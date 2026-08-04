import { prisma } from "@/lib/prisma";
import { seedHomepageContent } from "@/lib/seed-homepage";
import { CustomizeManager } from "@/components/admin/customize-manager";

export const dynamic = "force-dynamic";

export default async function AdminCustomizePage() {
  await seedHomepageContent();

  const [carouselImages, saleImages, testimonials] = await Promise.all([
    prisma.roundCarouselImage.findMany({
      orderBy: { order: "asc" },
      select: { id: true, imageUrl: true, order: true, active: true },
    }),
    prisma.saleSectionImage.findMany({
      orderBy: { order: "asc" },
      select: { id: true, imageUrl: true, altText: true, order: true, active: true },
    }),
    prisma.testimonial.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name: true, imageUrl: true, photos: true, text: true, rating: true, order: true, active: true },
    }),
  ]);

  return (
    <div className="container-storefront space-y-10">
      <h1 className="font-hero text-3xl font-bold text-light-grey">
        Customize Storefront
      </h1>
      <CustomizeManager
        initialCarouselImages={carouselImages}
        initialSaleImages={saleImages}
        initialTestimonials={testimonials}
      />
    </div>
  );
}
