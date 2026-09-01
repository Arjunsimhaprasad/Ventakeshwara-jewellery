-- Seed Data: seed.sql
-- Description: Sample luxury jewellery categories, products, images, offers, and profiles.

-- Seed Categories
insert into categories (id, name, slug, description, image_url, is_active) values
('c0000000-0000-0000-0000-000000000001', 'Gold Jewellery', 'gold-jewellery', 'Exquisite 22k and 18k handcrafted gold necklaces, bangles, and rings.', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80', true),
('c0000000-0000-0000-0000-000000000002', 'Diamond Elegance', 'diamond-elegance', 'VVS1 certified solitaire diamond rings, earrings, and pendants.', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', true),
('c0000000-0000-0000-0000-000000000003', 'Polki & Heritage', 'polki-heritage', 'Uncut diamonds embedded in traditional Kundan gold setting.', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80', true),
('c0000000-0000-0000-0000-000000000004', 'Royal Gemstones', 'royal-gemstones', 'Natural Rubies, Emeralds, and Sapphires accented with brilliant diamonds.', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', true);

-- Seed Products
insert into products (id, category_id, name, slug, sku, description, material, jewellery_type, weight_grams, purity, making_charges, stone_information, price, discount_percentage, stock_quantity, status, is_featured) values
('f0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Royal Temple Lakshmi Necklace', 'royal-temple-lakshmi-necklace', 'VJ-GOLD-NK-001', 'Handcrafted 22K yellow gold temple necklace featuring intricate Goddess Lakshmi motif with hanging ghungroo beads.', 'Gold', 'Necklace', 48.500, '22K (916)', 12500.00, 'Natural Rubies and Emerald accents', 345000.00, 5.00, 3, 'active', true),
('f0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'Eternal Radiance Solitaire Ring', 'eternal-radiance-solitaire-ring', 'VJ-DIA-RN-002', 'Classic 18K white gold solitaire ring featuring a brilliant cut 1.5-carat VVS1 F-color natural diamond.', 'White Gold & Diamond', 'Ring', 6.200, '18K (750)', 4500.00, '1.5 Carat VVS1 F-Color Certified Diamond', 285000.00, 0.00, 5, 'active', true),
('f0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', 'Heritage Emerald Kundan Choker', 'heritage-emerald-kundan-choker', 'VJ-POLKI-CK-003', 'Traditional Mughal-inspired Polki choker necklace set in 22K hallmarked gold with Zambian emerald drops.', 'Gold & Polki', 'Choker', 65.000, '22K (916)', 24000.00, 'Uncut Diamonds (Polki) & Zambian Emeralds', 520000.00, 8.00, 2, 'active', true),
('f0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000004', 'Celestial Sapphire Earrings', 'celestial-sapphire-earrings', 'VJ-GEM-ER-004', 'Royal blue Ceylon sapphire drop earrings surrounded by a halo of round brilliant diamonds.', 'Rose Gold & Gemstone', 'Earrings', 12.800, '18K (750)', 6000.00, '4.2 Carats Natural Ceylon Sapphires & 0.8 Carat Diamonds', 195000.00, 0.00, 4, 'active', true),
('f0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001', 'Venkateshwara Classic Gold Bangle Set', 'classic-gold-bangle-set', 'VJ-GOLD-BG-005', 'Pair of handcrafted 22K yellow gold bangles with intricate floral filigree engraving.', 'Gold', 'Bangles', 34.200, '22K (916)', 8500.00, 'Solid Hallmarked Gold', 242000.00, 3.00, 8, 'active', false);

-- Seed Product Images
insert into product_images (product_id, image_url, alt_text, sort_order) values
('f0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80', 'Royal Temple Lakshmi Necklace Front View', 0),
('f0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80', 'Royal Temple Lakshmi Necklace Detail', 1),
('f0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', 'Eternal Radiance Solitaire Ring Main View', 0),
('f0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', 'Heritage Emerald Kundan Choker Main View', 0),
('f0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80', 'Celestial Sapphire Earrings Front', 0);

-- Seed Offers
insert into offers (id, title, description, code, discount_percentage, is_active) values
('e0000000-0000-0000-0000-000000000001', 'Royal Festal Offer', 'Enjoy 10% off on all Temple Gold collections', 'ROYAL10', 10.00, true),
('e0000000-0000-0000-0000-000000000002', 'Welcome Luxury Gift', 'Rs. 5000 flat discount on Solitaire purchases', 'WELCOMEVJ', 5.00, true);
