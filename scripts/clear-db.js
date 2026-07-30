require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const tables = [
    ["wishlist", "Wishlist"],
    ["orderItem", "OrderItem"],
    ["product", "Product"],
    ["order", "Order"],
    ["siteSettings", "SiteSettings"],
    ["roundCarouselImage", "RoundCarouselImage"],
    ["saleSectionImage", "SaleSectionImage"],
    ["testimonial", "Testimonial"],
  ];

  for (const [key, name] of tables) {
    const result = await prisma[key].deleteMany();
    console.log(name + ": deleted " + result.count + " rows");
  }

  await prisma.$disconnect();
  console.log("\nAll tables cleared.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
