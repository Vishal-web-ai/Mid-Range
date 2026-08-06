"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type Specification = { label: string; value: string };

type ProductDetailsProps = {
  specifications?: Specification[] | null;
  details?: string[];
};

const SHIPPING_POINTS = [
  "We offer FREE shipping across India.",
  "Orders are dispatched within 1–2 business days of placement.",
  "Orders placed on weekends or public holidays are processed the next business day.",
  "You will receive an order confirmation email once your order is placed.",
  "Delivery usually takes 4-7 working days depending on your location.",
];

const RETURN_ELIGIBILITY = [
  "Returned within 7 days of delivery",
  "Item is unused, unwashed & unworn",
  "Original tags and packaging are intact",
  "Item is not from the sale or clearance section",
  "Proof of purchase (order ID / receipt) is provided",
];

function ToggleButton({
  label,
  open,
  onClick,
  className,
}: {
  label: string;
  open: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className={`text-light-grey hover:text-signal-red flex w-full items-center justify-between gap-3 py-3 font-hero text-base font-bold tracking-wider uppercase transition-colors ${className ?? ""}`}
    >
      <span>
        {open ? "−" : "+"} {label}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
}

function Collapse({ open, children }: { open: boolean; children: ReactNode }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">(0);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    if (open) {
      setHeight(el.scrollHeight);
      const id = setTimeout(() => setHeight("auto"), 320);
      return () => clearTimeout(id);
    }

    setHeight(el.scrollHeight);
    const id = setTimeout(() => setHeight(0), 20);
    return () => clearTimeout(id);
  }, [open]);

  const style: CSSProperties = { height: height === "auto" ? "auto" : `${height}px` };

  return (
    <div
      ref={innerRef}
      className="overflow-hidden transition-[height] duration-300 ease-in-out"
      style={style}
    >
      {children}
    </div>
  );
}

export default function ProductDetails({ specifications, details }: ProductDetailsProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [shippingOpen, setShippingOpen] = useState(false);
  const [returnsOpen, setReturnsOpen] = useState(false);

  const specs = specifications && specifications.length > 0 ? specifications : null;
  const bullets = specs ? null : details && details.length > 0 ? details : null;
  const hasDetails = !!(specs || bullets);

  return (
    <div>
      {hasDetails && (
        <>
          <ToggleButton label="Product Details" open={detailsOpen} onClick={() => setDetailsOpen((prev) => !prev)} />

          <Collapse open={detailsOpen}>
            {specs ? (
              <div className="border-steel-gray/40 grid grid-cols-[1fr_1px_1fr] gap-y-px border-x border-y bg-steel-gray/40">
                {specs.map((spec, i) => (
                  <Fragment key={i}>
                    <div className="bg-[#0F0F0F] px-4 py-2.5">
                      <span className="text-light-grey text-sm font-semibold">{spec.label}</span>
                    </div>
                    <div aria-hidden />
                    <div className="bg-[#0F0F0F] px-4 py-2.5 text-right">
                      <span className="text-light-grey text-sm font-medium">{spec.value}</span>
                    </div>
                  </Fragment>
                ))}
              </div>
            ) : (
              <ul className="flex flex-col gap-1 py-3">
                {bullets?.map((detail, i) => (
                  <li key={i} className="text-light-grey flex items-start gap-2 text-sm">
                    <span className="text-signal-red mt-0.5">+</span>
                    {detail}
                  </li>
                ))}
              </ul>
            )}
          </Collapse>
        </>
      )}

      <ToggleButton label="Shipping Info" open={shippingOpen} onClick={() => setShippingOpen((prev) => !prev)} />

      <Collapse open={shippingOpen}>
        <div className="flex flex-col gap-3 pb-3">
          <p className="text-light-grey text-sm leading-relaxed font-semibold">
            We make sure your order reaches you safely, on time, and in perfect condition. We ship across India with
            trusted delivery partners — because your comfort starts the moment you place your order.
          </p>
          <ul className="flex flex-col gap-1">
            {SHIPPING_POINTS.map((point, i) => (
              <li key={i} className="text-light-grey flex items-start gap-2 text-sm">
                <span className="text-signal-red mt-0.5">+</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </Collapse>

      <ToggleButton label="Return & Refund Policy" open={returnsOpen} onClick={() => setReturnsOpen((prev) => !prev)} />

      <Collapse open={returnsOpen}>
        <div className="flex flex-col gap-3 pb-3">
          <p className="text-light-grey text-sm leading-relaxed font-semibold">
            Your satisfaction is our priority. If something isn&apos;t right, we&apos;re here to make it right — quickly,
            fairly, and without the hassle. Please intimate us about the return/exchange on our whatsapp no.{" "}
            <span className="text-signal-red">+91-8510080764</span> and we will initiate the process within 24 hrs.
          </p>

          <div className="flex flex-col gap-2">
            <p className="text-light-grey font-hero text-sm font-bold tracking-wider uppercase">Cancellations</p>
            <p className="text-light-grey text-sm">
              You can cancel your item(s) within one hour after your order is confirmed. After 1 hour, cancellation will
              not be possible. In case of any emergency, please contact on whatsapp +91-8510080764 / Email us at{" "}
              <span className="text-signal-red">midrange4@gmail.com</span>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-light-grey font-hero text-sm font-bold tracking-wider uppercase">Easy Returns</p>
            <p className="text-light-grey text-sm">
              For Prepaid Orders — The full amount is refunded into your initial payment mode (bank account, credit
              card, etc.) within 5-7 days.
            </p>
            <ul className="flex flex-col gap-1">
              <li className="text-light-grey flex items-start gap-2 text-sm">
                <span className="text-signal-red mt-0.5">+</span>
                We will arrange a pick-up within 2-3 days of your request.
              </li>
              <li className="text-light-grey flex items-start gap-2 text-sm">
                <span className="text-signal-red mt-0.5">+</span>
                We will update you via email / whatsapp message once the refund is initiated.
              </li>
              <li className="text-light-grey flex items-start gap-2 text-sm">
                <span className="text-signal-red mt-0.5">+</span>
                NEED HELP? please contact us at 8510080764 and our support team will help you out.
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-light-grey font-hero text-sm font-bold tracking-wider uppercase">
              Items are eligible for return/exchange ONLY if:
            </p>
            <ul className="flex flex-col gap-1">
              {RETURN_ELIGIBILITY.map((point, i) => (
                <li key={i} className="text-light-grey flex items-start gap-2 text-sm">
                  <span className="text-signal-red mt-0.5">+</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-light-grey text-sm">
            Defective, incorrect, or damaged items must be reported within 24 hours of delivery for an eligible return.
          </p>
        </div>
      </Collapse>
    </div>
  );
}
