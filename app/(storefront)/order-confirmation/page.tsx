import Link from "next/link";

export default function OrderConfirmationPage() {
  return (
    <main className="container-storefront flex flex-col items-center justify-center py-24 text-center">
      <div className="bg-signal-red/15 flex h-16 w-16 items-center justify-center rounded-full">
        <svg
          className="text-signal-red h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="font-hero text-light-grey mt-6 text-4xl font-bold tracking-wider uppercase">
        Order Confirmed
      </h1>

      <p className="text-steel-gray mt-3 max-w-md text-lg">
        Payment received. Your piece is on its way — you&apos;ll get an update when it ships.
      </p>

      <Link href="/" className="btn-primary mt-10">
        Back to Shop
      </Link>
    </main>
  );
}
