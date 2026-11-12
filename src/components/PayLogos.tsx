import type { ReactNode } from "react";

// Payment brand marks drawn inline. Brand colours are fixed by each brand's guidelines, so they are not theme tokens.
type Brand = "visa" | "mastercard" | "amex" | "interac" | "crypto";

const box =
  "flex h-9 w-14 items-center justify-center rounded-md border border-border bg-card shadow-sm";

const logos: Record<Brand, { label: string; el: ReactNode }> = {
  visa: {
    label: "Visa",
    el: <span className="text-base font-black italic tracking-tight" style={{ color: "#1A1F71" }}>VISA</span>,
  },
  mastercard: {
    label: "Mastercard",
    el: (
      <svg viewBox="0 0 38 24" className="h-6 w-9" aria-hidden>
        <circle cx="14" cy="12" r="9" fill="#EB001B" />
        <circle cx="24" cy="12" r="9" fill="#F79E1B" />
        <path d="M19 4.4a9 9 0 0 1 0 15.2 9 9 0 0 1 0-15.2Z" fill="#FF5F00" />
      </svg>
    ),
  },
  amex: {
    label: "American Express",
    el: (
      <span className="flex h-full w-full items-center justify-center rounded-md text-[10px] font-black leading-none tracking-tight" style={{ background: "#2E77BC", color: "#fff" }}>
        AMEX
      </span>
    ),
  },
  interac: {
    label: "Interac e-Transfer",
    el: (
      <span className="flex h-full w-full items-center justify-center rounded-md text-[10px] font-black" style={{ background: "#FDB913", color: "#1C1C1C" }}>
        Interac
      </span>
    ),
  },
  crypto: {
    label: "Bitcoin, Ethereum, USDT",
    el: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <circle cx="12" cy="12" r="11" fill="#F7931A" />
        <text x="12" y="16.5" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff">₿</text>
      </svg>
    ),
  },
};

export function PayLogos({ only }: { only?: Brand[] }) {
  const list = only ?? (Object.keys(logos) as Brand[]);
  return (
    <div className="flex flex-wrap gap-2">
      {list.map((b) => (
        <span key={b} className={box} title={logos[b].label} aria-label={logos[b].label} role="img">
          {logos[b].el}
        </span>
      ))}
    </div>
  );
}
