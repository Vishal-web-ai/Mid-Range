import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "MidRange — Gen-Z Thrift Store",
    template: "%s | MidRange",
  },
  description: "One-of-one thrift finds. Bold style, honest prices. Curated secondhand clothing for men and women.",
  openGraph: {
    title: "MidRange — Gen-Z Thrift Store",
    description: "One-of-one thrift finds. Bold style, honest prices.",
    type: "website",
    siteName: "MidRange",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <div className="flex-1">{children}</div>
          <Toaster
            position="bottom-right"
            icons={{
              success: (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E11D2E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
              ),
            }}
            toastOptions={{
              classNames: {
                toast: "!w-auto !min-w-0 !max-w-[200px]",
              },
              style: {
                background: "#E11D2E",
                color: "#f5f5f5",
                border: "1px solid #9B1C24",
                fontSize: "16px",
                padding: "16px 12px",
                columnGap: "16px",
                borderRadius: "8px",
              },
            }}
          />
        </CartProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var el=document.documentElement;var cores=navigator.hardwareConcurrency;var mem=(navigator.deviceMemory||0);if((typeof cores==="number"&&cores<=4)||(mem>0&&mem<=4)){el.dataset.device="low-end";}}catch(e){}})();`,
          }}
        />
      </body>
    </html>
  );
}
