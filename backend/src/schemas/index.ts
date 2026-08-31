import { z } from 'zod';

export const UserRoleSchema = z.enum(['customer', 'staff', 'admin', 'owner']);
export const OrderStatusSchema = z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']);
export const SupportStatusSchema = z.enum(['open', 'in_progress', 'resolved', 'closed']);
export const ProductStatusSchema = z.enum(['active', 'inactive']);

// Auth Schemas
export const RegisterSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional()
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// Product Schemas
export const CreateProductSchema = z.object({
  categoryId: z.string().uuid().optional().nullable(),
  name: z.string().min(2, 'Product name is required'),
  slug: z.string().min(2, 'Slug is required'),
  sku: z.string().min(2, 'SKU is required'),
  description: z.string().optional(),
  material: z.string().optional(),
  jewelleryType: z.string().optional(),
  weightGrams: z.number().positive('Weight must be positive').optional(),
  purity: z.string().optional(),
  makingCharges: z.number().nonnegative('Making charges cannot be negative').default(0),
  stoneInformation: z.string().optional(),
  price: z.number().positive('Price must be greater than zero'),
  discountPercentage: z.number().min(0).max(100).default(0),
  stockQuantity: z.number().int().nonnegative().default(0),
  status: ProductStatusSchema.default('active'),
  isFeatured: z.boolean().default(false),
  images: z.array(z.object({
    imageUrl: z.string().url(),
    altText: z.string().optional(),
    sortOrder: z.number().int().default(0)
  })).optional()
});

export const UpdateProductSchema = CreateProductSchema.partial();

// Category Schemas
export const CreateCategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().default(true)
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

// Cart Schemas
export const AddToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive()
});

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().positive()
});

// Wishlist Schemas
export const AddToWishlistSchema = z.object({
  productId: z.string().min(1, 'Product ID is required')
});

// Order Checkout Schema
export const CheckoutSchema = z.object({
  shippingName: z.string().min(2, 'Shipping name required'),
  shippingPhone: z.string().min(6, 'Valid phone number required'),
  shippingAddress: z.string().min(5, 'Full shipping address required'),
  notes: z.string().optional(),
  couponCode: z.string().optional()
});

export const UpdateOrderStatusSchema = z.object({
  status: OrderStatusSchema
});

// Support Ticket Schemas
export const CreateTicketSchema = z.object({
  orderId: z.string().uuid().optional().nullable(),
  subject: z.string().min(3, 'Subject required'),
  category: z.string().min(2, 'Category required'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

export const UpdateTicketSchema = z.object({
  status: SupportStatusSchema.optional(),
  assignedTo: z.string().uuid().optional().nullable(),
  replyMessage: z.string().optional()
});

// Offer Schema
export const CreateOfferSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  code: z.string().min(3).toUpperCase(),
  discountPercentage: z.number().min(0).max(100),
  startAt: z.string().optional(),
  endAt: z.string().optional(),
  isActive: z.boolean().default(true)
});

export const UpdateOfferSchema = CreateOfferSchema.partial();

// AI Schemas
export const AIChatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).min(1),
  conversationId: z.string().uuid().optional()
});

export const AIRecommendSchema = z.object({
  userPreferences: z.object({
    category: z.string().optional(),
    material: z.string().optional(),
    maxPrice: z.number().optional(),
    occasion: z.string().optional(),
    purity: z.string().optional()
  })
});

export const AICompareSchema = z.object({
  productIds: z.array(z.string().uuid()).min(2).max(4)
});

export const AISupportAssistantSchema = z.object({
  ticketId: z.string().uuid()
});

export const AIBusinessInsightsSchema = z.object({
  timeframeDays: z.number().default(30)
});

// Metal Rate Schema
export const UpdateMetalRatesSchema = z.object({
  gold24kPerGram: z.number().positive('24K gold rate must be positive'),
  gold22kPerGram: z.number().positive('22K gold rate must be positive'),
  gold18kPerGram: z.number().positive('18K gold rate must be positive'),
  silverPerGram: z.number().positive('Silver rate must be positive'),
  notes: z.string().optional()
});

