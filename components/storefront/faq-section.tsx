"use client";

import { useState } from "react";
import ScrollReveal from "@/components/ui/scroll-reveal";

const faqs = [
  {
    q: "How do I find the right size?",
    a: "Each listing includes measurements and photos of the actual item. Since every piece is one-of-one, sizes vary — check the dimensions against a similar item you already own.",
  },
  {
    q: "What condition are thrifted items in?",
    a: "Condition is listed per item (Excellent, Good, Vintage Patina). Any flaws are photographed and described. We never send surprises.",
  },
  {
    q: "Can I return or exchange?",
    a: "Yes — 7 days from delivery. Items must be unworn and in the same condition. See our full policy for details.",
  },
  {
    q: "How long does shipping take?",
    a: "Orders ship within 1-2 business days. Domestic delivery takes 3-7 days depending on your location.",
  },
  {
    q: "What payment methods?",
    a: "Razorpay (cards, UPI, net banking) and direct UPI. All payments processed securely — we never store your payment details.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-spacing">
      <div className="container-wide">
        <div className="border-steel-gray/20 border-t pt-16">
          <h2 className="font-hero font-bold max-w-4xl text-xl leading-[1.1] tracking-wide uppercase sm:text-3xl md:whitespace-nowrap lg:text-5xl">
            Frequently Asked <span className="text-signal-red">Questions</span>
          </h2>
          <div className="mt-8">
            {faqs.map((faq, i) => (
              <ScrollReveal key={faq.q} delay={i * 60}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className={`border-steel-gray/20 w-full py-5 text-left transition-colors ${
                    i === 0 ? "border-t" : ""
                  } hover:bg-white/[0.03] border-b`}
                >
                  <div className="flex items-start gap-4">
                    <span className="font-hero text-signal-red/40 shrink-0 text-sm font-bold tracking-wider">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="font-hero text-light-grey text-sm font-bold tracking-wider uppercase">
                          {faq.q}
                        </h3>
                        <span
                          className={`text-signal-red shrink-0 transition-transform duration-200 ${
                            openIndex === i ? "rotate-45" : ""
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </span>
                      </div>
                      <div
                        className="overflow-hidden transition-all duration-300"
                        style={{
                          maxHeight: openIndex === i ? "200px" : "0",
                          opacity: openIndex === i ? 1 : 0,
                          marginTop: openIndex === i ? "0.75rem" : "0",
                        }}
                      >
                        <p className="text-steel-gray text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                </button>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
