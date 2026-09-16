import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const addressSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  company: z.string().optional(),
  address1: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().optional(),
  type: z.enum(["shipping", "billing"]).default("shipping"),
  isDefault: z.boolean().default(false),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDesc: z.string().max(300).optional(),
  sku: z.string().min(1, "SKU is required"),
  price: z.number().positive("Price must be positive"),
  compareAtPrice: z.number().positive().optional().nullable(),
  costPrice: z.number().positive().optional().nullable(),
  weight: z.number().positive().optional().nullable(),
  categoryId: z.string().min(1, "Category is required"),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  trackInventory: z.boolean().default(true),
});

export const variantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  price: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0).default(0),
  attributes: z.record(z.string()).default({}),
  position: z.number().int().default(0),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  image: z.string().url().optional().or(z.literal("")),
  parentId: z.string().optional().nullable(),
});

export const couponSchema = z.object({
  code: z.string().min(1, "Code is required").toUpperCase(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.enum(["percentage", "fixed", "free_shipping"]),
  value: z.number().positive("Value must be positive"),
  minOrderAmount: z.number().positive().optional().nullable(),
  maxDiscount: z.number().positive().optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
  userLimit: z.number().int().positive().optional().nullable(),
  startsAt: z.date().optional().nullable(),
  expiresAt: z.date().optional().nullable(),
  isActive: z.boolean().default(true),
  appliesTo: z.enum(["all", "products", "categories"]).default("all"),
  productIds: z.array(z.string()).default([]),
  categoryIds: z.array(z.string()).default([]),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  content: z.string().min(10, "Review must be at least 10 characters").max(2000),
  images: z.array(z.string().url()).default([]),
});

export const checkoutSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  shippingMethodId: z.string().min(1, "Shipping method is required"),
  paymentMethodId: z.string().optional(),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

export const settingsSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  type: z.enum(["string", "number", "boolean", "json"]).default("string"),
  group: z.string().default("general"),
  label: z.string().optional(),
  description: z.string().optional(),
});
