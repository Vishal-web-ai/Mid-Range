import { prisma } from "./prisma";

const SEED_FLAG = "homepage-content-seeded";

const carouselFallbacks = [
  "/clothes/672414455_17861864229682647_3753836623058430552_n..jpg",
  "/clothes/671244443_17861866125682647_1055540794517676545_n..jpg",
  "/clothes/671172413_17861842770682647_7895852993908659170_n..jpg",
  "/clothes/671106172_17861862861682647_9060639759909450645_n..jpg",
  "/clothes/670981231_17861868180682647_8729711116844242284_n..jpg",
  "/clothes/670954849_17861859261682647_6344359944749683983_n..jpg",
  "/clothes/670885305_17861866086682647_4525697963580129592_n..jpg",
];

const saleFallbacks = [
  { imageUrl: "/sale-section/sale.png", altText: "₹200 off on orders above ₹2,000. Use code RangerOP" },
  { imageUrl: "/sale-section/free-shipping.png", altText: "Free shipping on your first order. Use code BecomeRanger" },
];

const testimonialFallbacks = [
  {
    name: "Arjun Mehta",
    text: "Found a vintage Carhartt jacket I'd been hunting for months. Condition was exactly as described. MidRange is legit.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    text: "The quality check is real. Every stitch was inspected. No surprises when it arrived. Already ordered my third piece.",
    rating: 5,
  },
  {
    name: "Kabir Singh",
    text: "Finally a thrift store that doesn't use stock photos. What I saw online is exactly what showed up at my door.",
    rating: 5,
  },
  {
    name: "Nisha Kapoor",
    text: "Bought Y2K Nike cargo pants for ₹800. My friends thought I spent way more. This platform is a goldmine.",
    rating: 5,
  },
  {
    name: "Rohan Das",
    text: "Return policy gave me confidence to try it. The jacket fit perfectly so I never needed it, but knowing it was there mattered.",
    rating: 5,
  },
  {
    name: "Simran Kaur",
    text: "I've tried every thrift page on Instagram. MidRange is the only one that felt curated, not chaotic. Everything has a story.",
    rating: 5,
  },
];

export async function seedHomepageContent() {
  try {
    await prisma.siteSettings.create({ data: { key: SEED_FLAG, value: "true" } });
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2002") {
      return;
    }
    throw err;
  }

  const [carouselCount, saleCount, testimonialCount] = await Promise.all([
    prisma.roundCarouselImage.count(),
    prisma.saleSectionImage.count(),
    prisma.testimonial.count(),
  ]);

  if (carouselCount === 0) {
    await prisma.roundCarouselImage.createMany({
      data: carouselFallbacks.map((imageUrl, order) => ({ imageUrl, order, active: true })),
    });
  }

  if (saleCount === 0) {
    await prisma.saleSectionImage.createMany({
      data: saleFallbacks.map((s, order) => ({ ...s, order, active: true })),
    });
  }

  if (testimonialCount === 0) {
    await prisma.testimonial.createMany({
      data: testimonialFallbacks.map((t, order) => ({ ...t, order, active: true })),
    });
  }
}
