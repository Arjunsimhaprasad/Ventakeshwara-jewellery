import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../server';

describe('Venkateshwara Jewellery API - Security, RBAC & Checkout Verification', () => {
  let customerToken: string;
  let adminToken: string;

  beforeAll(async () => {
    // Register customer
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Test Customer',
        email: `testcustomer-${Date.now()}@example.com`,
        password: 'Password123!',
        phone: '+919999999999'
      });
    expect(regRes.status).toBe(201);
    customerToken = regRes.body.token;

    // Login owner/admin
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'anajipuramarjun8@gmail.com',
        password: 'akhilavirat'
      });
    expect(loginRes.status).toBe(200);
    adminToken = loginRes.body.token;
  });

  it('1. Security Test: Customer token calling POST /api/products gets 403 Forbidden', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        name: 'Unauthorized Product Creation Attempt',
        slug: 'unauthorized-product',
        sku: 'HACK-001',
        price: 10,
        stockQuantity: 100
      });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Forbidden');
  });

  it('2. Admin token can successfully create product via POST /api/products', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Admin Gold Pendant',
        slug: `admin-gold-pendant-${Date.now()}`,
        sku: `ADM-PD-${Date.now()}`,
        description: 'Luxury gold pendant',
        material: 'Gold',
        price: 45000,
        makingCharges: 3500,
        stockQuantity: 10,
        status: 'active'
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Admin Gold Pendant');
  });

  it('3. Checkout Test: Server re-derives order prices strictly from database', async () => {
    // Add item to customer cart
    const addCartRes = await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        productId: 'p0000000-0000-0000-0000-000000000001', // Price in DB = 345000, 5% discount -> 327750
        quantity: 1
      });
    expect([200, 201]).toContain(addCartRes.status);

    // Attempt checkout sending spoofed price payload
    const checkoutRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        shippingName: 'Test Buyer',
        shippingPhone: '+919876543210',
        shippingAddress: '123 Heritage Palace Road, Hyderabad',
        spoofedPrice: 1.00 // Server MUST ignore client price claims!
      });

    expect(checkoutRes.status).toBe(201);
    expect(checkoutRes.body.subtotal).toBe(327750); // Computed strictly from DB price and discount
    expect(checkoutRes.body.totalAmount).toBe(327750);
  });

  it('4. Pre-seeded Demo Customer login succeeds and issues valid token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'customer@example.com',
        password: 'password123'
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('customer@example.com');
    expect(res.body.user.role).toBe('customer');
  });

  it('5. AI Chat Endpoint POST /api/ai/chat returns intelligent concierge response', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({
        messages: [
          { role: 'user', content: 'What is the price and purity of your Royal Temple Lakshmi Necklace?' }
        ]
      });

    expect(res.status).toBe(200);
    expect(res.body.text).toBeDefined();
    expect(typeof res.body.text).toBe('string');
    expect(res.body.text.length).toBeGreaterThan(10);
  });
});
