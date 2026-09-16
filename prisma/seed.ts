import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const adminPassword = await bcrypt.hash("admin123", 12);
  const customerPassword = await bcrypt.hash("customer123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      name: "John Customer",
      password: customerPassword,
      role: "CUSTOMER",
      emailVerified: new Date(),
    },
  });

  console.log("✅ Users created");

  const electronics = await prisma.category.upsert({
    where: { slug: "electronics" },
    update: {},
    create: {
      name: "Electronics",
      slug: "electronics",
      description: "Latest electronic devices and gadgets",
    },
  });

  const clothing = await prisma.category.upsert({
    where: { slug: "clothing" },
    update: {},
    create: {
      name: "Clothing",
      slug: "clothing",
      description: "Fashion and apparel for all occasions",
    },
  });

  const home = await prisma.category.upsert({
    where: { slug: "home-garden" },
    update: {},
    create: {
      name: "Home & Garden",
      slug: "home-garden",
      description: "Everything for your home and garden",
    },
  });

  const sports = await prisma.category.upsert({
    where: { slug: "sports" },
    update: {},
    create: {
      name: "Sports & Outdoors",
      slug: "sports",
      description: "Sporting goods and outdoor equipment",
    },
  });

  const phones = await prisma.category.upsert({
    where: { slug: "smartphones" },
    update: {},
    create: {
      name: "Smartphones",
      slug: "smartphones",
      description: "Latest smartphones and accessories",
      parentId: electronics.id,
    },
  });

  const laptops = await prisma.category.upsert({
    where: { slug: "laptops" },
    update: {},
    create: {
      name: "Laptops",
      slug: "laptops",
      description: "Powerful laptops for work and play",
      parentId: electronics.id,
    },
  });

  console.log("✅ Categories created");

  const products = [
    {
      name: "iPhone 15 Pro",
      slug: "iphone-15-pro",
      description: "The ultimate iPhone with A17 Pro chip, titanium design, and advanced camera system.",
      shortDesc: "Latest iPhone with titanium design and A17 Pro chip",
      sku: "IPH15PRO-128",
      price: 999.00,
      compareAtPrice: 1099.00,
      categoryId: phones.id,
      isFeatured: true,
      images: [
        { url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop", alt: "iPhone 15 Pro", position: 0 },
      ],
      variants: [
        { name: "128GB", sku: "IPH15PRO-128", price: 999.00, stock: 50, attributes: { storage: "128GB" }, position: 0 },
        { name: "256GB", sku: "IPH15PRO-256", price: 1099.00, stock: 30, attributes: { storage: "256GB" }, position: 1 },
        { name: "512GB", sku: "IPH15PRO-512", price: 1299.00, stock: 20, attributes: { storage: "512GB" }, position: 2 },
        { name: "1TB", sku: "IPH15PRO-1TB", price: 1499.00, stock: 10, attributes: { storage: "1TB" }, position: 3 },
      ],
    },
    {
      name: "MacBook Pro 16\" M3 Max",
      slug: "macbook-pro-16-m3-max",
      description: "Supercharged by M3 Max chip. Up to 22-hour battery life. Stunning Liquid Retina XDR display.",
      shortDesc: "Most powerful MacBook Pro with M3 Max chip",
      sku: "MBP16-M3MAX",
      price: 3499.00,
      compareAtPrice: 3699.00,
      categoryId: laptops.id,
      isFeatured: true,
      images: [
        { url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop", alt: "MacBook Pro 16", position: 0 },
      ],
      variants: [
        { name: "36GB/1TB", sku: "MBP16-M3MAX-36-1", price: 3499.00, stock: 15, attributes: { memory: "36GB", storage: "1TB" }, position: 0 },
        { name: "48GB/1TB", sku: "MBP16-M3MAX-48-1", price: 3699.00, stock: 10, attributes: { memory: "48GB", storage: "1TB" }, position: 1 },
        { name: "96GB/2TB", sku: "MBP16-M3MAX-96-2", price: 4299.00, stock: 5, attributes: { memory: "96GB", storage: "2TB" }, position: 2 },
      ],
    },
    {
      name: "Samsung Galaxy S24 Ultra",
      slug: "samsung-galaxy-s24-ultra",
      description: "Galaxy AI is here. Circle to Search, Live Translate, and 200MP camera.",
      shortDesc: "Galaxy AI smartphone with 200MP camera",
      sku: "SGS24U-256",
      price: 1299.00,
      compareAtPrice: 1399.00,
      categoryId: phones.id,
      isFeatured: true,
      images: [
        { url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop", alt: "Samsung Galaxy S24 Ultra", position: 0 },
      ],
      variants: [
        { name: "256GB", sku: "SGS24U-256", price: 1299.00, stock: 25, attributes: { storage: "256GB" }, position: 0 },
        { name: "512GB", sku: "SGS24U-512", price: 1379.00, stock: 15, attributes: { storage: "512GB" }, position: 1 },
        { name: "1TB", sku: "SGS24U-1TB", price: 1549.00, stock: 8, attributes: { storage: "1TB" }, position: 2 },
      ],
    },
    {
      name: "Classic Cotton T-Shirt",
      slug: "classic-cotton-tshirt",
      description: "Premium 100% organic cotton t-shirt. Pre-shrunk, soft, and durable for everyday wear.",
      shortDesc: "100% organic cotton, pre-shrunk",
      sku: "CCT-BLK-M",
      price: 29.99,
      compareAtPrice: 39.99,
      categoryId: clothing.id,
      isFeatured: false,
      images: [
        { url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop", alt: "Classic Cotton T-Shirt", position: 0 },
      ],
      variants: [
        { name: "S / Black", sku: "CCT-BLK-S", price: 29.99, stock: 100, attributes: { size: "S", color: "Black" }, position: 0 },
        { name: "M / Black", sku: "CCT-BLK-M", price: 29.99, stock: 150, attributes: { size: "M", color: "Black" }, position: 1 },
        { name: "L / Black", sku: "CCT-BLK-L", price: 29.99, stock: 150, attributes: { size: "L", color: "Black" }, position: 2 },
        { name: "XL / Black", sku: "CCT-BLK-XL", price: 29.99, stock: 100, attributes: { size: "XL", color: "Black" }, position: 3 },
        { name: "S / White", sku: "CCT-WHT-S", price: 29.99, stock: 100, attributes: { size: "S", color: "White" }, position: 4 },
        { name: "M / White", sku: "CCT-WHT-M", price: 29.99, stock: 150, attributes: { size: "M", color: "White" }, position: 5 },
        { name: "L / White", sku: "CCT-WHT-L", price: 29.99, stock: 150, attributes: { size: "L", color: "White" }, position: 6 },
        { name: "XL / White", sku: "CCT-WHT-XL", price: 29.99, stock: 100, attributes: { size: "XL", color: "White" }, position: 7 },
      ],
    },
    {
      name: "Slim Fit Denim Jeans",
      slug: "slim-fit-denim-jeans",
      description: "Modern slim fit jeans with stretch comfort. Classic 5-pocket styling.",
      shortDesc: "Stretch denim with modern slim fit",
      sku: "SFDJ-BLU-32",
      price: 79.99,
      compareAtPrice: 99.99,
      categoryId: clothing.id,
      isFeatured: true,
      images: [
        { url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop", alt: "Slim Fit Denim Jeans", position: 0 },
      ],
      variants: [
        { name: "30x30 / Blue", sku: "SFDJ-BLU-30-30", price: 79.99, stock: 50, attributes: { waist: "30", length: "30", color: "Blue" }, position: 0 },
        { name: "32x32 / Blue", sku: "SFDJ-BLU-32-32", price: 79.99, stock: 75, attributes: { waist: "32", length: "32", color: "Blue" }, position: 1 },
        { name: "34x32 / Blue", sku: "SFDJ-BLU-34-32", price: 79.99, stock: 75, attributes: { waist: "34", length: "32", color: "Blue" }, position: 2 },
        { name: "36x32 / Blue", sku: "SFDJ-BLU-36-32", price: 79.99, stock: 50, attributes: { waist: "36", length: "32", color: "Blue" }, position: 3 },
        { name: "32x32 / Black", sku: "SFDJ-BLK-32-32", price: 79.99, stock: 60, attributes: { waist: "32", length: "32", color: "Black" }, position: 4 },
        { name: "34x32 / Black", sku: "SFDJ-BLK-34-32", price: 79.99, stock: 60, attributes: { waist: "34", length: "32", color: "Black" }, position: 5 },
      ],
    },
    {
      name: "Ceramic Plant Pot Set",
      slug: "ceramic-plant-pot-set",
      description: "Set of 3 handcrafted ceramic pots with drainage holes and saucers. Perfect for indoor plants.",
      shortDesc: "Set of 3 ceramic pots with saucers",
      sku: "CPP-SET-3",
      price: 49.99,
      compareAtPrice: 69.99,
      categoryId: home.id,
      isFeatured: false,
      images: [
        { url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&h=800&fit=crop", alt: "Ceramic Plant Pot Set", position: 0 },
      ],
      variants: [
        { name: "White Set", sku: "CPP-WHT-3", price: 49.99, stock: 40, attributes: { color: "White", count: "3" }, position: 0 },
        { name: "Terracotta Set", sku: "CPP-TER-3", price: 49.99, stock: 35, attributes: { color: "Terracotta", count: "3" }, position: 1 },
        { name: "Sage Green Set", sku: "CPP-SAG-3", price: 49.99, stock: 30, attributes: { color: "Sage Green", count: "3" }, position: 2 },
      ],
    },
    {
      name: "Yoga Mat Premium",
      slug: "yoga-mat-premium",
      description: "Extra thick 6mm non-slip yoga mat with carrying strap. Eco-friendly TPE material.",
      shortDesc: "6mm non-slip eco-friendly yoga mat",
      sku: "YMP-PUR",
      price: 39.99,
      compareAtPrice: 49.99,
      categoryId: sports.id,
      isFeatured: false,
      images: [
        { url: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=800&fit=crop", alt: "Premium Yoga Mat", position: 0 },
      ],
      variants: [
        { name: "Purple", sku: "YMP-PUR", price: 39.99, stock: 60, attributes: { color: "Purple" }, position: 0 },
        { name: "Blue", sku: "YMP-BLU", price: 39.99, stock: 55, attributes: { color: "Blue" }, position: 1 },
        { name: "Pink", sku: "YMP-PNK", price: 39.99, stock: 50, attributes: { color: "Pink" }, position: 2 },
        { name: "Black", sku: "YMP-BLK", price: 39.99, stock: 45, attributes: { color: "Black" }, position: 3 },
      ],
    },
    {
      name: "Wireless Noise-Canceling Headphones",
      slug: "wireless-noise-canceling-headphones",
      description: "Industry-leading noise cancellation with 30-hour battery life. Premium sound quality.",
      shortDesc: "30hr battery, industry-leading ANC",
      sku: "WNCH-BLK",
      price: 349.99,
      compareAtPrice: 399.99,
      categoryId: electronics.id,
      isFeatured: true,
      images: [
        { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop", alt: "Wireless Headphones", position: 0 },
      ],
      variants: [
        { name: "Black", sku: "WNCH-BLK", price: 349.99, stock: 30, attributes: { color: "Black" }, position: 0 },
        { name: "Silver", sku: "WNCH-SLV", price: 349.99, stock: 25, attributes: { color: "Silver" }, position: 1 },
        { name: "Blue", sku: "WNCH-BLU", price: 349.99, stock: 20, attributes: { color: "Blue" }, position: 2 },
      ],
    },
  ];

  for (const productData of products) {
    const { variants, images, ...product } = productData;

    const existingProduct = await prisma.product.findUnique({
      where: { sku: product.sku },
    });

    if (!existingProduct) {
      await prisma.product.create({
        data: {
          ...product,
          images: { create: images },
          variants: { create: variants },
        },
      });
    }
  }

  console.log("✅ Products created");

  const coupon = await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      name: "Welcome Discount",
      description: "10% off your first order",
      type: "percentage",
      value: 10,
      minOrderAmount: 50,
      maxDiscount: 50,
      usageLimit: 100,
      userLimit: 1,
      isActive: true,
    },
  });

  console.log("✅ Coupon created");

  const settings = [
    { key: "store_name", value: "Ecommerce", type: "string", group: "general", label: "Store Name" },
    { key: "store_email", value: "orders@example.com", type: "string", group: "general", label: "Store Email" },
    { key: "currency", value: "USD", type: "string", group: "general", label: "Currency" },
    { key: "tax_rate", value: "0.08", type: "number", group: "checkout", label: "Tax Rate" },
    { key: "free_shipping_threshold", value: "100", type: "number", group: "shipping", label: "Free Shipping Threshold" },
    { key: "flat_rate_shipping", value: "9.99", type: "number", group: "shipping", label: "Flat Rate Shipping" },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log("✅ Settings created");
  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });