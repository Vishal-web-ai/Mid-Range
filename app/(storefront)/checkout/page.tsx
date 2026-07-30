"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";
import { z } from "zod";

const CheckoutFormSchema = z.object({
  fullName: z.string().min(1, "Name is required").max(200),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .max(15)
    .regex(/^[+]?[\d\s-]{10,15}$/, "Enter a valid Indian phone number"),
  address: z.string().min(5, "Address is required").max(500),
});

type CheckoutFormValues = z.infer<typeof CheckoutFormSchema>;

type FormErrors = Partial<Record<keyof CheckoutFormValues, string>>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<CheckoutFormValues>({
    fullName: "",
    phone: "",
    address: "",
  });

  if (items.length === 0 && !submitting) {
    return (
      <main className="container-storefront py-16 text-center">
        <h1 className="font-hero text-light-grey text-4xl">Checkout</h1>
        <p className="text-steel-gray mt-4 text-lg">Your cart is empty.</p>
        <Link href="/" className="btn-primary mt-8 inline-block">
          Continue Shopping
        </Link>
      </main>
    );
  }

  const total = getCartTotal();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CheckoutFormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = CheckoutFormSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CheckoutFormValues;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });

      if (!res.ok) throw new Error("Payment failed");

      clearCart();
      router.push("/order-confirmation");
    } catch {
      setErrors({ address: "Something went wrong. Please try again." });
      setSubmitting(false);
    }
  }

  return (
    <main className="container-storefront py-8 md:py-12">
      <h1 className="font-hero text-light-grey text-4xl">Checkout</h1>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-5">
          <div>
            <label htmlFor="fullName" className="text-light-grey mb-1 block text-sm font-medium">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              className={cn(
                "bg-white/5 text-light-grey w-full rounded border px-3 py-2.5 transition-colors outline-none",
                "focus:border-signal-red",
                errors.fullName ? "border-signal-red" : "border-steel-gray/40",
              )}
              placeholder="Jane Doe"
            />
            {errors.fullName && <p className="text-signal-red mt-1 text-sm">{errors.fullName}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="text-light-grey mb-1 block text-sm font-medium">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className={cn(
                "bg-white/5 text-light-grey w-full rounded border px-3 py-2.5 transition-colors outline-none",
                "focus:border-signal-red",
                errors.phone ? "border-signal-red" : "border-steel-gray/40",
              )}
              placeholder="+91 98765 43210"
            />
            {errors.phone && <p className="text-signal-red mt-1 text-sm">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="address" className="text-light-grey mb-1 block text-sm font-medium">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows={4}
              value={form.address}
              onChange={handleChange}
              className={cn(
                "bg-white/5 text-light-grey w-full resize-none rounded border px-3 py-2.5 transition-colors outline-none",
                "focus:border-signal-red",
                errors.address ? "border-signal-red" : "border-steel-gray/40",
              )}
              placeholder="Street, City, State, PIN"
            />
            {errors.address && <p className="text-signal-red mt-1 text-sm">{errors.address}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={cn("btn-primary w-full", submitting && "pointer-events-none opacity-60")}
          >
            {submitting ? "Processing..." : `Pay ₹${(total / 100).toLocaleString("en-IN")}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="w-full flex-shrink-0 lg:w-80">
          <div className="border-steel-gray/30 bg-white/5 rounded-md border p-6">
            <h2 className="font-hero text-light-grey text-xl">Order Summary</h2>

            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span className="text-light-grey truncate pr-2">
                    {item.title}
                    {item.size ? ` (${item.size})` : ""}
                  </span>
                  <span className="text-light-grey flex-shrink-0 font-medium">
                    ₹{(item.price / 100).toLocaleString("en-IN")}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-steel-gray/20 mt-4 border-t pt-4">
              <div className="text-light-grey flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>₹{(total / 100).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
