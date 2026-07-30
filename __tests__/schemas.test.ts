import { ProductSchema, CreateOrderSchema } from "@/lib/schemas";

describe("ProductSchema", () => {
  const validProduct = {
    title: "Vintage Denim Jacket",
    slug: "vintage-denim-jacket",
    description: "Classic 90s denim jacket",
    price: 150000, // 1500 INR in paise
    size: "M",
    category: "Jackets",
    condition: "Good",
    images: ["https://res.cloudinary.com/test/image/upload/v1/test.jpg"],
    status: "available" as const,
  };

  it("should accept a valid product", () => {
    const result = ProductSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  it("should reject empty title", () => {
    const result = ProductSchema.safeParse({ ...validProduct, title: "" });
    expect(result.success).toBe(false);
  });

  it("should reject negative price", () => {
    const result = ProductSchema.safeParse({ ...validProduct, price: -100 });
    expect(result.success).toBe(false);
  });

  it("should reject empty images array", () => {
    const result = ProductSchema.safeParse({ ...validProduct, images: [] });
    expect(result.success).toBe(false);
  });

  it("should reject invalid image URLs", () => {
    const result = ProductSchema.safeParse({
      ...validProduct,
      images: ["not-a-url"],
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid status", () => {
    const result = ProductSchema.safeParse({ ...validProduct, status: "pending" });
    expect(result.success).toBe(false);
  });

  it("should default status to available", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { status, ...noStatus } = validProduct;
    const result = ProductSchema.safeParse(noStatus);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("available");
    }
  });
});

describe("CreateOrderSchema", () => {
  const validOrder = {
    buyerName: "Rahul Sharma",
    buyerPhone: "9876543210",
    buyerAddress: "123 Main St, Mumbai, Maharashtra",
    items: [{ productId: "clx123456", price: 150000 }],
  };

  it("should accept a valid order", () => {
    const result = CreateOrderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  it("should reject short phone number", () => {
    const result = CreateOrderSchema.safeParse({
      ...validOrder,
      buyerPhone: "12345",
    });
    expect(result.success).toBe(false);
  });

  it("should reject empty items", () => {
    const result = CreateOrderSchema.safeParse({
      ...validOrder,
      items: [],
    });
    expect(result.success).toBe(false);
  });

  it("should reject short address", () => {
    const result = CreateOrderSchema.safeParse({
      ...validOrder,
      buyerAddress: "ab",
    });
    expect(result.success).toBe(false);
  });
});
