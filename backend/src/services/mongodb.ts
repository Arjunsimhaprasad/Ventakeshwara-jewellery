import mongoose, { Schema, Document } from 'mongoose';

// 1. Profile Schema
export interface IProfile extends Document {
  fullName: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: 'customer' | 'staff' | 'admin' | 'owner';
  avatarUrl?: string;
}

const ProfileSchema = new Schema<IProfile>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['customer', 'staff', 'admin', 'owner'], default: 'customer' },
  avatarUrl: { type: String }
}, { timestamps: true });

// 2. Category Schema
export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  imageUrl: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// 3. Product Schema
export interface IProduct extends Document {
  categoryId?: string;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  material: string;
  jewelleryType: string;
  weightGrams: number;
  purity: string;
  makingCharges: number;
  stoneInformation?: string;
  price: number;
  discountPercentage: number;
  stockQuantity: number;
  status: 'active' | 'inactive';
  isFeatured: boolean;
  images: { imageUrl: string; altText?: string; sortOrder: number }[];
}

const ProductSchema = new Schema<IProduct>({
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  sku: { type: String, required: true, unique: true },
  description: { type: String },
  material: { type: String, default: 'Gold' },
  jewelleryType: { type: String, default: 'Necklace' },
  weightGrams: { type: Number, default: 0 },
  purity: { type: String, default: '22K (916)' },
  makingCharges: { type: Number, default: 0 },
  stoneInformation: { type: String },
  price: { type: Number, required: true, min: 0 },
  discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
  stockQuantity: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  isFeatured: { type: Boolean, default: false },
  images: [{ imageUrl: String, altText: String, sortOrder: Number }]
}, { timestamps: true });

// 4. Order Schema
export interface IOrder extends Document {
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
  items: {
    productId?: string;
    productName: string;
    sku?: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
  }[];
}

const OrderSchema = new Schema<IOrder>({
  userId: { type: String, required: true },
  orderNumber: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  subtotal: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  shippingName: { type: String, required: true },
  shippingPhone: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  notes: { type: String },
  items: [{
    productId: String,
    productName: String,
    sku: String,
    unitPrice: Number,
    quantity: Number,
    subtotal: Number
  }]
}, { timestamps: true });

// 5. Offer Schema
export interface IOffer extends Document {
  title: string;
  description?: string;
  code: string;
  discountPercentage: number;
  isActive: boolean;
}

const OfferSchema = new Schema<IOffer>({
  title: { type: String, required: true },
  description: { type: String },
  code: { type: String, required: true, unique: true, uppercase: true },
  discountPercentage: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Mongoose Models Exports
export const ProfileModel = mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);
export const CategoryModel = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
export const ProductModel = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export const OrderModel = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export const OfferModel = mongoose.models.Offer || mongoose.model<IOffer>('Offer', OfferSchema);

export async function connectMongoDB(uri?: string): Promise<boolean> {
  const mongoUri = uri || process.env.MONGODB_URI;
  if (!mongoUri) return false;

  try {
    await mongoose.connect(mongoUri);
    console.log('🍃 Successfully connected to MongoDB Database');
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    return false;
  }
}
