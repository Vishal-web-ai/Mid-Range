import { z } from "zod";

export function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const suffix = Math.random().toString(36).substring(2, 8);
  return `${base}-${suffix}`;
}

export const ProductSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  price: z.number().int().positive("Price must be positive"), // in paise
  discountedPrice: z.number().int().positive().optional(),
  size: z.string().max(20).optional(),
  tag: z.string().max(50).nullable().optional(),
  category: z.string().max(100).optional(),
  condition: z.string().max(100).optional(),
  gender: z.enum(["men", "women", "unisex"]).optional(),
  details: z.array(z.string()).optional(),
  specifications: z
    .array(
      z.object({
        label: z.string().min(1, "Label is required").max(100),
        value: z.string().min(1, "Value is required").max(300),
      })
    )
    .optional(),
  images: z.array(z.string().url()).min(1, "At least one image required"),
  status: z.enum(["available", "sold"]).default("available"),
});

export const CreateProductSchema = ProductSchema.omit({ id: true }).extend({
  slug: z.string().max(200).optional(),
});

export const UpdateProductSchema = ProductSchema.partial().required({ id: true });

export const OrderItemSchema = z.object({
  productId: z.string().min(1),
  price: z.number().int().positive(),
});

export const CreateOrderSchema = z.object({
  buyerName: z.string().min(1, "Name is required").max(200),
  buyerPhone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .max(15)
    .regex(/^\+?[\d-]+$/, "Invalid phone number"),
  buyerAddress: z.string().min(5, "Address is required").max(500),
  items: z.array(OrderItemSchema).min(1, "At least one item required"),
});

export const RazorpayOrderSchema = z.object({
  amount: z.number().int().positive(), // in paise
  receipt: z.string().optional(),
});

export const RazorpayVerifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export const UpdateOrderStatusSchema = z.object({
  orderStatus: z.enum(["placed", "shipped", "delivered"]),
});
