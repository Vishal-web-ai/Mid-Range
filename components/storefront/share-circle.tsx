"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type ShareCircleProps = {
  title: string;
};

function getShareUrl(title: string) {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = `Check out "${title}" on MidRange`;
  return { url, text };
}

async function copyLink() {
  const { url } = getShareUrl("");
  try {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied");
  } catch {
    toast.error("Couldn't copy link");
  }
}

export default function ShareCircle({ title }: ShareCircleProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function onDocumentClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocumentClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const { url } = getShareUrl(title);
  const waLink = `https://wa.me/?text=${encodeURIComponent(`${getShareUrl(title).text} ${url}`)}`;

  const spring = "ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]";
  const hidden = open ? "translate-x-0 scale-100 opacity-100 visible" : "-translate-x-6 scale-50 opacity-0 invisible pointer-events-none";

  const brands = [
    {
      id: "whatsapp",
      label: "Share on WhatsApp",
      href: mounted ? waLink : "#",
      background: "#25D366",
      textColor: "text-white",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
    {
      id: "instagram",
      label: "Share on Instagram",
      href: undefined,
      background: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
      textColor: "text-white",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      id: "snapchat",
      label: "Share on Snapchat",
      href: undefined,
      background: "#FFFC00",
      textColor: "text-ink-black",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M12 2C9.2 2 8 3.9 8 5.9c0 1.5.5 2.7.5 4.1-.4 0-.7-.1-1-.3-.6-.4-1.2-.7-2-.6-.8.1-1.3.6-1.3 1.2 0 1 .6 1.5 1.1 2 .5.5 1 .8 1 .8-.1.6-.3 1.1-.3 1.5 0 1 .7 1.6 1.8 1.6.5 0 1.1-.1 1.9-.3.5 1.2 1.3 2.3 2.6 2.3 1.3 0 2.1-1.1 2.6-2.3.8.2 1.4.3 1.9.3 1.1 0 1.8-.6 1.8-1.6 0-.4-.2-.9-.3-1.5 0 0 .5-.3 1-.8.5-.5 1.1-1 1.1-2 0-.6-.5-1.1-1.3-1.2-.8-.1-1.4.2-2 .6-.3.2-.6.3-1 .3 0-1.4.5-2.6.5-4.1C16 3.9 14.8 2 12 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close share menu" : "Share"}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
          open
            ? "rotate-180 border-steel-gray bg-steel-gray/20 text-light-grey"
            : "border-steel-gray/50 bg-dark-grey text-light-grey hover:-translate-y-0.5 hover:border-steel-gray hover:bg-steel-gray/20"
        }`}
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
          </svg>
        )}
      </button>

      <div className="absolute top-1/2 left-full z-10 flex -translate-y-1/2 items-center gap-1.5 pl-2">
        {brands.map((brand, i) => {
          const classes = `flex h-9 w-9 items-center justify-center rounded-full shadow-lg transition-all duration-500 ${spring} ${hidden} ${brand.textColor}`;
          const style = { background: brand.background, transitionDelay: open ? `${i * 80}ms` : "0ms" };
          return brand.href ? (
            <a
              key={brand.id}
              href={brand.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={brand.label}
              onClick={() => setOpen(false)}
              className={classes}
              style={style}
            >
              {brand.icon}
            </a>
          ) : (
            <button
              key={brand.id}
              type="button"
              aria-label={brand.label}
              onClick={() => {
                copyLink();
                setOpen(false);
              }}
              className={classes}
              style={style}
            >
              {brand.icon}
            </button>
          );
        })}
      </div>
    </div>
  );
}
