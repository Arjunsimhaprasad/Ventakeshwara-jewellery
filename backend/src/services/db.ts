import { createClient } from '@supabase/supabase-js';

// Pre-seeded initial data for local development & testing
export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRecord {
  id: string;
  categoryId: string | null;
  name: string;
  slug: string;
  sku: string;
  description: string;
  material: string;
  jewelleryType: string;
  weightGrams: number;
  purity: string;
  makingCharges: number;
  stoneInformation: string;
  price: number;
  discountPercentage: number;
  stockQuantity: number;
  status: 'active' | 'inactive';
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  images?: { id: string; imageUrl: string; altText?: string; sortOrder: number }[];
}

export interface ProfileRecord {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: 'customer' | 'staff' | 'admin' | 'owner';
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItemRecord {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  product?: ProductRecord;
}

export interface WishlistItemRecord {
  id: string;
  wishlistId: string;
  productId: string;
  createdAt: string;
  product?: ProductRecord;
}

export interface OrderItemRecord {
  id: string;
  orderId: string;
  productId: string | null;
  productName: string;
  sku?: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderRecord {
  id: string;
  userId: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItemRecord[];
}

export interface OfferRecord {
  id: string;
  title: string;
  description?: string;
  code: string;
  discountPercentage: number;
  startAt?: string;
  endAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicketRecord {
  id: string;
  userId: string;
  orderId?: string | null;
  subject: string;
  category: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string | null;
  createdAt: string;
  updatedAt: string;
  userFullName?: string;
}

export interface AuditLogRecord {
  id: string;
  actorId: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: any;
  createdAt: string;
}

class InMemoryDatabase {
  categories: CategoryRecord[] = [
    {
      id: 'c0000000-0000-0000-0000-000000000001',
      name: 'Gold Jewellery',
      slug: 'gold-jewellery',
      description: 'Exquisite 22k and 18k handcrafted gold necklaces, bangles, and rings.',
      imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'c0000000-0000-0000-0000-000000000002',
      name: 'Diamond Elegance',
      slug: 'diamond-elegance',
      description: 'VVS1 certified solitaire diamond rings, earrings, and pendants.',
      imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'c0000000-0000-0000-0000-000000000003',
      name: 'Polki & Heritage',
      slug: 'polki-heritage',
      description: 'Uncut diamonds embedded in traditional Kundan gold setting.',
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'c0000000-0000-0000-0000-000000000004',
      name: 'Royal Gemstones',
      slug: 'royal-gemstones',
      description: 'Natural Rubies, Emeralds, and Sapphires accented with brilliant diamonds.',
      imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  products: ProductRecord[] = [
    {
      id: 'p0000000-0000-0000-0000-000000000001',
      categoryId: 'c0000000-0000-0000-0000-000000000001',
      name: 'Royal Temple Lakshmi Necklace',
      slug: 'royal-temple-lakshmi-necklace',
      sku: 'VJ-GOLD-NK-001',
      description: 'Handcrafted 22K yellow gold temple necklace featuring intricate Goddess Lakshmi motif with hanging ghungroo beads.',
      material: 'Gold',
      jewelleryType: 'Necklace',
      weightGrams: 48.5,
      purity: '22K (916)',
      makingCharges: 12500,
      stoneInformation: 'Natural Rubies and Emerald accents',
      price: 345000,
      discountPercentage: 5,
      stockQuantity: 3,
      status: 'active',
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: 'img-1', imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80', altText: 'Front view', sortOrder: 0 },
        { id: 'img-2', imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80', altText: 'Detail view', sortOrder: 1 }
      ]
    },
    {
      id: 'p0000000-0000-0000-0000-000000000002',
      categoryId: 'c0000000-0000-0000-0000-000000000002',
      name: 'Eternal Radiance Solitaire Ring',
      slug: 'eternal-radiance-solitaire-ring',
      sku: 'VJ-DIA-RN-002',
      description: 'Classic 18K white gold solitaire ring featuring a brilliant cut 1.5-carat VVS1 F-color natural diamond.',
      material: 'White Gold & Diamond',
      jewelleryType: 'Ring',
      weightGrams: 6.2,
      purity: '18K (750)',
      makingCharges: 4500,
      stoneInformation: '1.5 Carat VVS1 F-Color Certified Diamond',
      price: 285000,
      discountPercentage: 0,
      stockQuantity: 5,
      status: 'active',
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: 'img-3', imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', altText: 'Solitaire Ring Front', sortOrder: 0 }
      ]
    },
    {
      id: 'p0000000-0000-0000-0000-000000000003',
      categoryId: 'c0000000-0000-0000-0000-000000000003',
      name: 'Heritage Emerald Kundan Choker',
      slug: 'heritage-emerald-kundan-choker',
      sku: 'VJ-POLKI-CK-003',
      description: 'Traditional Mughal-inspired Polki choker necklace set in 22K hallmarked gold with Zambian emerald drops.',
      material: 'Gold & Polki',
      jewelleryType: 'Choker',
      weightGrams: 65.0,
      purity: '22K (916)',
      makingCharges: 24000,
      stoneInformation: 'Uncut Diamonds (Polki) & Zambian Emeralds',
      price: 520000,
      discountPercentage: 8,
      stockQuantity: 2,
      status: 'active',
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: 'img-4', imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', altText: 'Choker Set', sortOrder: 0 }
      ]
    },
    {
      id: 'p0000000-0000-0000-0000-000000000004',
      categoryId: 'c0000000-0000-0000-0000-000000000004',
      name: 'Celestial Sapphire Drop Earrings',
      slug: 'celestial-sapphire-earrings',
      sku: 'VJ-GEM-ER-004',
      description: 'Royal blue Ceylon sapphire drop earrings surrounded by a halo of round brilliant diamonds.',
      material: 'Rose Gold & Gemstone',
      jewelleryType: 'Earrings',
      weightGrams: 12.8,
      purity: '18K (750)',
      makingCharges: 6000,
      stoneInformation: '4.2 Carats Natural Ceylon Sapphires & 0.8 Carat Diamonds',
      price: 195000,
      discountPercentage: 0,
      stockQuantity: 4,
      status: 'active',
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: 'img-5', imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80', altText: 'Sapphire Earrings', sortOrder: 0 }
      ]
    }
  ];

  profiles: ProfileRecord[] = [];
  carts: { id: string; userId: string }[] = [];
  cartItems: CartItemRecord[] = [];
  wishlists: { id: string; userId: string }[] = [];
  wishlistItems: WishlistItemRecord[] = [];
  orders: OrderRecord[] = [];
  offers: OfferRecord[] = [
    {
      id: 'o0000000-0000-0000-0000-000000000001',
      title: 'Royal Festal Offer',
      description: 'Enjoy 10% off on all Temple Gold collections',
      code: 'ROYAL10',
      discountPercentage: 10.0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'o0000000-0000-0000-0000-000000000002',
      title: 'Welcome Luxury Gift',
      description: '5% flat discount on Solitaire purchases',
      code: 'WELCOMEVJ',
      discountPercentage: 5.0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  supportTickets: SupportTicketRecord[] = [];
  auditLogs: AuditLogRecord[] = [];
}

export const db = new InMemoryDatabase();
