import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const products = [
  {
    title: "Vintage Y2K Gothic Flared Denim",
    slug: "vintage-y2k-gothic-flared-denim",
    price: 249900,
    discountedPrice: 89900,
    images: ["/clothes/Vintage Y2K Women's Gothic Embroidery Flared Denim Jeans _ Wide Leg Goth Punk Streetwear Pants.jpg"],
    size: "M",
    category: "Bottoms",
    condition: "Good",
    status: "available",
    featured: true,
  },
  {
    title: "Rothco Vintage Paratrooper Fatigues",
    slug: "rothco-vintage-paratrooper-fatigues",
    price: 189900,
    discountedPrice: 99900,
    images: ["/clothes/Rothco Vintage Paratrooper Fatigue Pants Vintage Cargo Pants Camouflage Pants.jpg"],
    size: "L",
    category: "Bottoms",
    condition: "Good",
    status: "available",
    featured: false,
  },
  {
    title: "Old Money Summer Shirt",
    slug: "old-money-summer-shirt",
    price: 129900,
    discountedPrice: 69900,
    images: ["/clothes/Old Money Summer Shirt for men 2026.jpg"],
    size: "S",
    category: "Tops",
    condition: "Like New",
    status: "available",
    featured: true,
  },
  {
    title: "Streetwear Graphic Tee",
    slug: "streetwear-graphic-tee",
    price: 89900,
    discountedPrice: 49900,
    images: ["/clothes/672414455_17861864229682647_3753836623058430552_n..jpg"],
    size: "M",
    category: "Tops",
    condition: "Good",
    status: "available",
    featured: false,
  },
  {
    title: "Oversized Vintage Hoodie",
    slug: "oversized-vintage-hoodie",
    price: 159900,
    discountedPrice: 79900,
    images: ["/clothes/671244443_17861866125682647_1055540794517676545_n..jpg"],
    size: "L",
    category: "Outerwear",
    condition: "Good",
    status: "available",
    featured: true,
  },
  {
    title: "Retro Cargo Joggers",
    slug: "retro-cargo-joggers",
    price: 139900,
    discountedPrice: 74900,
    images: ["/clothes/671172413_17861842770682647_7895852993908659170_n..jpg"],
    size: "M",
    category: "Bottoms",
    condition: "Like New",
    status: "available",
    featured: false,
  },
  {
    title: "Distressed Denim Jacket",
    slug: "distressed-denim-jacket",
    price: 219900,
    discountedPrice: 119900,
    images: ["/clothes/671106172_17861862861682647_9060639759909450645_n..jpg"],
    size: "XL",
    category: "Outerwear",
    condition: "Fair",
    status: "available",
    featured: false,
  },
  {
    title: "Urban Utility Vest",
    slug: "urban-utility-vest",
    price: 179900,
    discountedPrice: 89900,
    images: ["/clothes/670981231_17861868180682647_8729711116844242284_n..jpg"],
    size: "L",
    category: "Outerwear",
    condition: "Good",
    status: "available",
    featured: false,
  },
  {
    title: "Grunge Layered Tee",
    slug: "grunge-layered-tee",
    price: 99900,
    discountedPrice: 49900,
    images: ["/clothes/670954849_17861859261682647_6344359944749683983_n..jpg"],
    size: "S",
    category: "Tops",
    condition: "Fair",
    status: "available",
    featured: false,
  },
  {
    title: "Vintage Workwear Shirt",
    slug: "vintage-workwear-shirt",
    price: 149900,
    discountedPrice: 79900,
    images: ["/clothes/670885305_17861866086682647_4525697963580129592_n..jpg"],
    size: "M",
    category: "Tops",
    condition: "Good",
    status: "available",
    featured: false,
  },
  {
    title: "Autumn Retro Stripe Polo",
    slug: "autumn-retro-stripe-polo",
    price: 119900,
    discountedPrice: 59900,
    images: ["/clothes/2025 Autumn High Street Retro Loose Stripe Stand Up Collar Top American Versatile Original Style Casual Long Sleeve Polo Shirt.jpg"],
    size: "L",
    category: "Tops",
    condition: "Like New",
    status: "available",
    featured: false,
  },
  {
    title: "1950s British Cyclist Leather Jacket",
    slug: "1950s-british-cyclist-leather-jacket",
    price: 349900,
    discountedPrice: 199900,
    images: ["/clothes/1950s British cyclist leather__This beautiful jacket and other exclusive vintage pieces will be available this Friday__thepuregarb_com ♻️.jpg"],
    size: "M",
    category: "Outerwear",
    condition: "Vintage",
    status: "available",
    featured: true,
  },
];

async function main() {
  console.log("Seeding database...");

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        price: p.price,
        images: p.images,
        size: p.size,
        category: p.category,
        condition: p.condition,
        status: p.status,
        featured: p.featured,
      },
    });
    console.log(`  ✓ ${p.title}`);
  }

  console.log("Seeding complete!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
