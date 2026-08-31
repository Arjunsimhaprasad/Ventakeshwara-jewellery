import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../server';

describe('Venkateshwara Jewellery API - Gold & Silver Rates Management', () => {
  let customerToken: string;
  let adminToken: string;

  beforeAll(async () => {
    // Register test customer
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Rates Customer',
        email: `ratescustomer-${Date.now()}@example.com`,
        password: 'Password123!',
        phone: '+919888877777'
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

  it('1. GET /api/rates/today returns current active metal rate for public user', async () => {
    const res = await request(app).get('/api/rates/today');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('gold24kPerGram');
    expect(res.body).toHaveProperty('gold22kPerGram');
    expect(res.body).toHaveProperty('gold18kPerGram');
    expect(res.body).toHaveProperty('silverPerGram');
    expect(typeof res.body.gold22kPerGram).toBe('number');
  });

  it('2. GET /api/rates/history returns historical rates list', async () => {
    const res = await request(app).get('/api/rates/history');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('3. Security Test: Customer role POST /api/rates is denied with 403 Forbidden', async () => {
    const res = await request(app)
      .post('/api/rates')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        gold24kPerGram: 8000,
        gold22kPerGram: 7300,
        gold18kPerGram: 6000,
        silverPerGram: 95
      });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Forbidden');
  });

  it('4. Admin/Staff role POST /api/rates updates today\'s gold price successfully', async () => {
    const newRate = {
      gold24kPerGram: 7450.50,
      gold22kPerGram: 6830.00,
      gold18kPerGram: 5580.00,
      silverPerGram: 89.50,
      notes: 'Morning bullion market update'
    };

    const res = await request(app)
      .post('/api/rates')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newRate);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('rate');
    expect(res.body.rate.gold24kPerGram).toBe(7450.50);
    expect(res.body.rate.gold22kPerGram).toBe(6830.00);

    // Verify GET /api/rates/today now returns the updated rate
    const todayRes = await request(app).get('/api/rates/today');
    expect(todayRes.status).toBe(200);
    expect(todayRes.body.gold24kPerGram).toBe(7450.50);
  });
});
