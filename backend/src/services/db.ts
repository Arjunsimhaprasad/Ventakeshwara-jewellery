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
  sku: string; // Design ID / SKU
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
  isPriceOnRequest?: boolean;
  variations?: string[];
  createdAt: string;
  updatedAt: string;
  images?: { id: string; imageUrl: string; altText?: string; sortOrder: number }[];
}

export interface CatalogueRecord {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  coverImage: string;
  pdfUrl: string;
  pageCount: number;
  itemCount: number;
  isFeatured: boolean;
  downloadCount: number;
  previewImages: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryRecord {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  preferredContact: 'whatsapp' | 'phone' | 'email';
  productId?: string | null;
  productName?: string | null;
  designId?: string | null;
  category?: string;
  message: string;
  status: 'new' | 'contacted' | 'in_discussion' | 'visited_store' | 'closed';
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
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

export interface MetalRateRecord {
  id: string;
  gold24kPerGram: number;
  gold22kPerGram: number;
  gold18kPerGram: number;
  silverPerGram: number;
  notes?: string;
  updatedBy?: string | null;
  createdAt: string;
}

class InMemoryDatabase {
  // 14 Official Jewellery Catalogue Categories
  categories: CategoryRecord[] = [
    {
      id: 'cat-gold',
      name: 'Gold',
      slug: 'gold',
      description: 'Handcrafted 22K (916) and 18K hallmarked yellow and rose gold jewellery.',
      imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'cat-diamond',
      name: 'Diamond',
      slug: 'diamond',
      description: 'VVS1/EF certified natural solitaires, floral clusters, and brilliant cut designs.',
      imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'cat-silver',
      name: 'Silver',
      slug: 'silver',
      description: 'Pure 925 Sterling Silver filigree, antique temple pooja articles, and contemporary wear.',
      imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'cat-bridal',
      name: 'Bridal',
      slug: 'bridal',
      description: 'Grand wedding trousseau sets, majestic haar, maang tikka, and vadanam sets.',
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'cat-necklaces',
      name: 'Necklaces',
      slug: 'necklaces',
      description: 'Chokers, long guttapusalu haars, kasu malas, and delicate contemporary collars.',
      imageUrl: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'cat-chains',
      name: 'Chains',
      slug: 'chains',
      description: 'Solid handcrafted gold rope chains, box chains, and traditional thali chains.',
      imageUrl: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'cat-bangles',
      name: 'Bangles',
      slug: 'bangles',
      description: 'Traditional kadas, filigree valayal, ruby pachalu bangles, and slip-on bangles.',
      imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'cat-bracelets',
      name: 'Bracelets',
      slug: 'bracelets',
      description: 'Contemporary diamond tennis bracelets, flexible gold cuffs, and charm bracelets.',
      imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'cat-rings',
      name: 'Rings',
      slug: 'rings',
      description: 'Engagement solitaires, navaratna cocktail rings, and gold bands.',
      imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'cat-earrings',
      name: 'Earrings',
      slug: 'earrings',
      description: 'Heritage jhumkas, chandelier drops, chandbalis, and daily solitaire studs.',
      imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'cat-pendants',
      name: 'Pendants',
      slug: 'pendants',
      description: 'Divine deity pendants, diamond solitaires, and coloured gemstone medallions.',
      imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'cat-antique',
      name: 'Antique',
      slug: 'antique',
      description: 'Oxidized heritage finish, Polki uncut diamond Kundan work, and heirloom revivals.',
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'cat-traditional',
      name: 'Traditional',
      slug: 'traditional',
      description: 'South Indian classics including Vanki, Oddiyanam, and heritage mango malas.',
      imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'cat-temple',
      name: 'Temple Jewellery',
      slug: 'temple-jewellery',
      description: 'Intricate nakshi work depicting Lakshmi, Ganesha, and peacocks in solid 22K gold.',
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Pre-seeded Showcase Designs
  products: ProductRecord[] = [
    {
      id: 'f0000000-0000-0000-0000-000000000001',
      categoryId: 'cat-temple',
      name: 'Royal Temple Lakshmi Nakshi Haar',
      slug: 'royal-temple-lakshmi-nakshi-haar',
      sku: 'VJ-TMP-NK-001',
      description: 'Heirloom 22K yellow gold temple necklace featuring hand-sculpted Goddess Lakshmi motif with hanging ghungroo beads and ruby emerald accents.',
      material: '22K Yellow Gold',
      jewelleryType: 'Temple Jewellery',
      weightGrams: 48.50,
      purity: '22K (916) BIS Hallmarked',
      makingCharges: 12500,
      stoneInformation: 'Natural Burmese Rubies and Zambian Emerald accents',
      price: 345000,
      discountPercentage: 5,
      stockQuantity: 3,
      status: 'active',
      isFeatured: true,
      isPriceOnRequest: false,
      variations: ['22K Yellow Gold (Standard)', 'Antique Matte Gold Finish', 'Custom Weight 40g-65g'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: 'img-1', imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80', altText: 'Temple Lakshmi Haar Front', sortOrder: 0 },
        { id: 'img-2', imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80', altText: 'Temple Lakshmi Haar Detail View', sortOrder: 1 }
      ]
    },
    {
      id: 'f0000000-0000-0000-0000-000000000002',
      categoryId: 'cat-diamond',
      name: 'Eternal Radiance Solitaire Diamond Ring',
      slug: 'eternal-radiance-solitaire-ring',
      sku: 'VJ-DIA-RN-002',
      description: 'Classic 18K white gold solitaire ring featuring a brilliant cut 1.5-carat VVS1 F-color natural certified diamond with micro-pavé shank.',
      material: '18K White Gold & Diamond',
      jewelleryType: 'Rings',
      weightGrams: 6.20,
      purity: '18K (750) & Certified Diamond',
      makingCharges: 4500,
      stoneInformation: '1.50 Carat VVS1 F-Color Certified Solitaire + 0.30ct Pavé Diamonds',
      price: 285000,
      discountPercentage: 0,
      stockQuantity: 5,
      status: 'active',
      isFeatured: true,
      isPriceOnRequest: false,
      variations: ['18K White Gold', '18K Rose Gold', '18K Yellow Gold', 'Sizes 8 to 22'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: 'img-3', imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', altText: 'Solitaire Ring Front View', sortOrder: 0 }
      ]
    },
    {
      id: 'f0000000-0000-0000-0000-000000000003',
      categoryId: 'cat-bridal',
      name: 'Imperial Mughal Polki Kundan Choker Set',
      slug: 'imperial-mughal-polki-kundan-choker',
      sku: 'VJ-BRD-ST-003',
      description: 'Traditional royal bridal choker set in 22K hallmarked gold with certified uncut Polki diamonds, Zambian emerald drops, and South Sea pearls.',
      material: '22K Gold & Uncut Polki',
      jewelleryType: 'Bridal',
      weightGrams: 92.40,
      purity: '22K (916) BIS Hallmarked',
      makingCharges: 32000,
      stoneInformation: 'Uncut Diamonds (Polki), Certified Zambian Emeralds, South Sea Pearls',
      price: 0,
      discountPercentage: 0,
      stockQuantity: 2,
      status: 'active',
      isFeatured: true,
      isPriceOnRequest: true, // Masterpiece Bridal - Price on Request
      variations: ['Includes Choker + Matching Chandbalis + Maang Tikka', 'Custom Ruby Edition Available'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: 'img-4', imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', altText: 'Polki Choker Set Front', sortOrder: 0 }
      ]
    },
    {
      id: 'f0000000-0000-0000-0000-000000000004',
      categoryId: 'cat-earrings',
      name: 'Celestial Sapphire & Diamond Drop Jhumkas',
      slug: 'celestial-sapphire-diamond-jhumkas',
      sku: 'VJ-GEM-ER-004',
      description: 'Royal blue Ceylon sapphire drop jhumkas surrounded by a brilliant halo of natural round diamonds in 18K rose gold.',
      material: '18K Rose Gold & Gemstones',
      jewelleryType: 'Earrings',
      weightGrams: 14.80,
      purity: '18K (750)',
      makingCharges: 6500,
      stoneInformation: '4.2 Carats Natural Ceylon Blue Sapphires & 0.85 Carat Diamonds',
      price: 195000,
      discountPercentage: 0,
      stockQuantity: 4,
      status: 'active',
      isFeatured: true,
      isPriceOnRequest: false,
      variations: ['18K Rose Gold with Blue Sapphire', '18K Yellow Gold with Emerald'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: 'img-5', imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80', altText: 'Sapphire Drop Earrings', sortOrder: 0 }
      ]
    },
    {
      id: 'f0000000-0000-0000-0000-000000000005',
      categoryId: 'cat-bangles',
      name: 'Venkateshwara Heritage Filigree Gold Kadas (Pair)',
      slug: 'heritage-filigree-gold-kadas',
      sku: 'VJ-GLD-BG-005',
      description: 'Pair of handcrafted 22K yellow gold screw-lock kadas featuring royal floral filigree and rava work by master goldsmiths.',
      material: '22K Yellow Gold',
      jewelleryType: 'Bangles',
      weightGrams: 42.60,
      purity: '22K (916) BIS Hallmarked',
      makingCharges: 9800,
      stoneInformation: 'Solid 22K Hallmarked Gold without stones',
      price: 298000,
      discountPercentage: 3,
      stockQuantity: 6,
      status: 'active',
      isFeatured: false,
      isPriceOnRequest: false,
      variations: ['Size 2.4', 'Size 2.6', 'Size 2.8', 'Single Kada or Pair'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: 'img-6', imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', altText: 'Filigree Gold Kadas Pair', sortOrder: 0 }
      ]
    },
    {
      id: 'f0000000-0000-0000-0000-000000000006',
      categoryId: 'cat-antique',
      name: 'Antique Guttapusalu Traditional Long Haar',
      slug: 'antique-guttapusalu-traditional-haar',
      sku: 'VJ-ANT-NK-006',
      description: 'Exquisite heritage Guttapusalu necklace with bunches of natural seed pearls fringed along a ruby and emerald studded antique 22K gold frame.',
      material: '22K Antique Gold',
      jewelleryType: 'Antique',
      weightGrams: 74.20,
      purity: '22K (916) Antique Finish',
      makingCharges: 21000,
      stoneInformation: 'Natural Basra-style Seed Pearls, Potta Rubies & Emeralds',
      price: 495000,
      discountPercentage: 0,
      stockQuantity: 2,
      status: 'active',
      isFeatured: true,
      isPriceOnRequest: false,
      variations: ['Antique Dull Gold Finish', 'High Polish Gold Finish'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: 'img-7', imageUrl: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80', altText: 'Guttapusalu Long Haar Front', sortOrder: 0 }
      ]
    },
    {
      id: 'f0000000-0000-0000-0000-000000000007',
      categoryId: 'cat-silver',
      name: '925 Sterling Silver Royal Antique Peacock Kada',
      slug: 'sterling-silver-royal-peacock-kada',
      sku: 'VJ-SLV-BG-007',
      description: 'Solid 925 hallmarked sterling silver handcrafted kada with twin peacock finials and oxidized vintage patina.',
      material: '925 Sterling Silver',
      jewelleryType: 'Silver',
      weightGrams: 58.00,
      purity: '925 Sterling Silver Hallmarked',
      makingCharges: 3200,
      stoneInformation: 'Natural Synthetic Spinel eye accents',
      price: 18500,
      discountPercentage: 0,
      stockQuantity: 12,
      status: 'active',
      isFeatured: false,
      isPriceOnRequest: false,
      variations: ['Oxidized Antique Finish', 'High Shine Rhodium Silver Finish'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: 'img-8', imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', altText: 'Silver Peacock Kada', sortOrder: 0 }
      ]
    },
    {
      id: 'f0000000-0000-0000-0000-000000000008',
      categoryId: 'cat-pendants',
      name: 'Sacred Tirupati Balaji Diamond & Gold Pendant',
      slug: 'tirupati-balaji-diamond-gold-pendant',
      sku: 'VJ-PND-BL-008',
      description: 'Divine 22K yellow gold Lord Venkateshwara pendant adorned with round brilliant natural diamonds and emerald tilak.',
      material: '22K Gold & Diamond',
      jewelleryType: 'Pendants',
      weightGrams: 16.50,
      purity: '22K (916) & Certified Diamonds',
      makingCharges: 5500,
      stoneInformation: '0.65 Carat Diamonds (VVS-FG) & Natural Emerald Tilak',
      price: 135000,
      discountPercentage: 4,
      stockQuantity: 5,
      status: 'active',
      isFeatured: true,
      isPriceOnRequest: false,
      variations: ['22K Yellow Gold (Standard)', '18K Two-Tone with White Gold Namam'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: 'img-9', imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80', altText: 'Lord Balaji Diamond Pendant', sortOrder: 0 }
      ]
    },
    {
      id: 'f0000000-0000-0000-0000-000000000009',
      categoryId: 'cat-chains',
      name: 'Solid 22K Gold Handcrafted Rudraksha Mala Chain',
      slug: 'solid-gold-rudraksha-mala-chain',
      sku: 'VJ-CHN-RD-009',
      description: 'Handcrafted 22K yellow gold links clasping natural 5-Mukhi certified Indonesian Rudraksha beads for daily and festive wear.',
      material: '22K Yellow Gold',
      jewelleryType: 'Chains',
      weightGrams: 28.20,
      purity: '22K (916) BIS Hallmarked',
      makingCharges: 6800,
      stoneInformation: 'Certified 5-Mukhi Sacred Rudraksha Beads',
      price: 198000,
      discountPercentage: 0,
      stockQuantity: 4,
      status: 'active',
      isFeatured: false,
      isPriceOnRequest: false,
      variations: ['Length 24 Inches (54 beads)', 'Length 28 Inches (108 beads)'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: 'img-10', imageUrl: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80', altText: 'Rudraksha Gold Chain', sortOrder: 0 }
      ]
    },
    {
      id: 'f0000000-0000-0000-0000-000000000010',
      categoryId: 'cat-bracelets',
      name: 'Illusion Solitaire Diamond Tennis Bracelet',
      slug: 'illusion-solitaire-diamond-tennis-bracelet',
      sku: 'VJ-BRC-TN-010',
      description: 'Continuous river of round brilliant cut diamonds set in 18K white gold with secure double-safety clasp.',
      material: '18K White Gold & Diamond',
      jewelleryType: 'Bracelets',
      weightGrams: 18.50,
      purity: '18K (750) Certified Diamonds',
      makingCharges: 9000,
      stoneInformation: '3.50 Carats Total Weight Natural Diamonds (VVS-VS, GH)',
      price: 360000,
      discountPercentage: 0,
      stockQuantity: 3,
      status: 'active',
      isFeatured: true,
      isPriceOnRequest: false,
      variations: ['18K White Gold', '18K Yellow Gold', '18K Rose Gold', 'Length 7" or 7.5"'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: 'img-11', imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', altText: 'Diamond Tennis Bracelet', sortOrder: 0 }
      ]
    },
    {
      id: 'f0000000-0000-0000-0000-000000000011',
      categoryId: 'cat-traditional',
      name: 'Heirloom South Indian Mango Mala (Manga Malai)',
      slug: 'heirloom-manga-malai-necklace',
      sku: 'VJ-TRD-MN-011',
      description: 'Iconic traditional mango motif necklace in 22K gold embedded with cabochon rubies and finished with hanging pearl beads.',
      material: '22K Yellow Gold',
      jewelleryType: 'Traditional',
      weightGrams: 62.00,
      purity: '22K (916) BIS Hallmarked',
      makingCharges: 16500,
      stoneInformation: 'Natural Untreated Cabochon Rubies & Natural Pearls',
      price: 435000,
      discountPercentage: 0,
      stockQuantity: 2,
      status: 'active',
      isFeatured: true,
      isPriceOnRequest: false,
      variations: ['Standard Length 22"', 'Grand Bridal Extended 26"'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: 'img-12', imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80', altText: 'Traditional Manga Malai', sortOrder: 0 }
      ]
    },
    {
      id: 'f0000000-0000-0000-0000-000000000012',
      categoryId: 'cat-bridal',
      name: 'Custom Bespoke Nizam Emerald & Diamond Choker',
      slug: 'custom-bespoke-nizam-choker',
      sku: 'VJ-BRD-NZ-012',
      description: 'Ultra-exclusive Nizam-inspired royal choker handcrafted with Colombian emeralds and rose cut diamonds. Made strictly to bespoke order.',
      material: '18K White Gold & Platinum',
      jewelleryType: 'Bridal',
      weightGrams: 85.00,
      purity: '18K (750) & Platinum 950',
      makingCharges: 45000,
      stoneInformation: 'Rare Colombian Emeralds & 8.5 Carats Rose Cut Diamonds',
      price: 0, // Price on Request
      discountPercentage: 0,
      stockQuantity: 1,
      status: 'active',
      isFeatured: true,
      isPriceOnRequest: true,
      variations: ['Custom Karigar Consultation Required', 'Stone Certification Included (GIA/GRS)'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: 'img-13', imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', altText: 'Bespoke Nizam Choker', sortOrder: 0 }
      ]
    }
  ];

  // Digital Catalogues & Lookbooks
  catalogues: CatalogueRecord[] = [
    {
      id: 'cat-lookbook-bridal-2026',
      title: 'Royal Heritage Bridal Lookbook 2026',
      slug: 'royal-heritage-bridal-lookbook-2026',
      description: 'Comprehensive high-resolution catalogue featuring majestic wedding trousseau, temple haar sets, chokers, and matching bridal vanki & vaddanam.',
      category: 'Bridal',
      coverImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      pdfUrl: '/catalogues/Venkateshwara_Bridal_Lookbook_2026.pdf',
      pageCount: 38,
      itemCount: 46,
      isFeatured: true,
      downloadCount: 1240,
      previewImages: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80'
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'cat-lookbook-temple-gold',
      title: 'Sacred Temple Gold & Nakshi Masterpieces',
      slug: 'sacred-temple-gold-nakshi-masterpieces',
      description: 'Devotional temple jewellery designs sculpted in 22K (916) hallmarked pure gold, celebrating Indian heritage, deities, and classical temple architecture.',
      category: 'Temple Jewellery',
      coverImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
      pdfUrl: '/catalogues/Venkateshwara_Temple_Gold_Catalogue.pdf',
      pageCount: 28,
      itemCount: 32,
      isFeatured: true,
      downloadCount: 890,
      previewImages: [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80'
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'cat-lookbook-solitaire-diamond',
      title: 'Solitaire & Diamond Elegance Vol. IV',
      slug: 'solitaire-diamond-elegance-vol-iv',
      description: 'Curated diamond collection showcasing certified solitaire rings, eternity bands, tennis bracelets, and diamond drop chandelier earrings.',
      category: 'Diamond',
      coverImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      pdfUrl: '/catalogues/Venkateshwara_Solitaire_Diamond_Elegance.pdf',
      pageCount: 24,
      itemCount: 28,
      isFeatured: true,
      downloadCount: 1045,
      previewImages: [
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80'
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'cat-lookbook-antique-polki',
      title: 'Heirloom Antique & Polki Kundan Lookbook',
      slug: 'heirloom-antique-polki-kundan-lookbook',
      description: 'Vintage treasures featuring uncut syndic diamonds, Potta rubies, and antique oxidized gold chokers handcrafted by generational artisan karigars.',
      category: 'Antique',
      coverImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
      pdfUrl: '/catalogues/Venkateshwara_Antique_Polki_Lookbook.pdf',
      pageCount: 30,
      itemCount: 35,
      isFeatured: false,
      downloadCount: 650,
      previewImages: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80'
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'cat-lookbook-sterling-silver',
      title: '925 Sterling Silver & Artifacts Lookbook',
      slug: 'sterling-silver-artifacts-lookbook',
      description: 'Pooja silverware, antique silver dinnerware, and contemporary hallmarked 925 sterling silver bracelets, kadas, and chains.',
      category: 'Silver',
      coverImage: 'https://images.unsplash.com/photo-1611591475102-460c7f735497?auto=format&fit=crop&w=800&q=80',
      pdfUrl: '/catalogues/Venkateshwara_Sterling_Silver_Catalogue.pdf',
      pageCount: 20,
      itemCount: 40,
      isFeatured: false,
      downloadCount: 430,
      previewImages: [
        'https://images.unsplash.com/photo-1611591475102-460c7f735497?auto=format&fit=crop&w=800&q=80'
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Customer Product Enquiries
  enquiries: EnquiryRecord[] = [
    {
      id: 'enq-1001',
      customerName: 'Priya Sharma',
      email: 'priyasharma.hyd@gmail.com',
      phone: '+91 98490 12345',
      preferredContact: 'whatsapp',
      productId: 'f0000000-0000-0000-0000-000000000003',
      productName: 'Imperial Mughal Polki Kundan Choker Set',
      designId: 'VJ-BRD-ST-003',
      category: 'Bridal',
      message: 'Hello, I am planning my wedding in December. Would love to know the price estimate for this bridal choker set and if matching maang tikka can be custom designed.',
      status: 'in_discussion',
      adminNotes: 'Contacted over WhatsApp on Oct 20. Shared detailed photos of matching tikka and invited for showroom preview.',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'enq-1002',
      customerName: 'Rameshwar Varma',
      email: 'rvarma.vizag@outlook.com',
      phone: '+91 94401 56789',
      preferredContact: 'phone',
      productId: 'f0000000-0000-0000-0000-000000000001',
      productName: 'Royal Temple Lakshmi Nakshi Haar',
      designId: 'VJ-TMP-NK-001',
      category: 'Temple Jewellery',
      message: 'Looking for 22K temple Lakshmi necklace for daughter wedding. Can this be made in 60 grams weight?',
      status: 'new',
      adminNotes: null,
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 'enq-1003',
      customerName: 'Ananya Reddy',
      email: 'ananya.reddy@gmail.com',
      phone: '+91 97000 88990',
      preferredContact: 'whatsapp',
      productId: 'f0000000-0000-0000-0000-000000000002',
      productName: 'Eternal Radiance Solitaire Diamond Ring',
      designId: 'VJ-DIA-RN-002',
      category: 'Rings',
      message: 'Interested in ring size 14 in 18K Rose Gold with GIA certificate verification.',
      status: 'contacted',
      adminNotes: 'Confirmed availability of 1.5ct solitaire with GIA cert.',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
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
      id: 'e0000000-0000-0000-0000-000000000001',
      title: 'Royal Festive Consultation Offer',
      description: 'Special bespoke making charge benefits on bridal trousseau booking',
      code: 'ROYAL10',
      discountPercentage: 10.0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  supportTickets: SupportTicketRecord[] = [];
  auditLogs: AuditLogRecord[] = [];
  metalRates: MetalRateRecord[] = [
    {
      id: 'd0000000-0000-0000-0000-000000000001',
      gold24kPerGram: 7350.00,
      gold22kPerGram: 6738.00,
      gold18kPerGram: 5512.00,
      silverPerGram: 88.00,
      notes: 'Initial market benchmark for Venkateshwara Jewellery',
      updatedBy: null,
      createdAt: new Date().toISOString()
    }
  ];
}

export const db = new InMemoryDatabase();

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = (SUPABASE_URL && !SUPABASE_URL.includes('your-project'))
  ? createClient(SUPABASE_URL, SUPABASE_SECRET_KEY)
  : null;
