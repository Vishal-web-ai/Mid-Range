import Navbar from "@/components/storefront/pill-navbar";
import Footer from "@/components/storefront/footer";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
