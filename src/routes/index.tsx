import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import hero from "@/assets/cancun-hero.jpg";
import gBeach from "@/assets/gallery-beach.jpg";
import gChichen from "@/assets/gallery-chichen.jpg";
import gCenote from "@/assets/gallery-cenote.jpg";
import gCatamaran from "@/assets/gallery-catamaran.jpg";

const reviews = [
  { name: "Priya S.", city: "Brampton, ON", trip: "Escape · 4 nights", text: "Booked through WhatsApp in one evening. Transfers were waiting when we landed and the resort was spotless." },
  { name: "Marc-André L.", city: "Laval, QC", trip: "Standard · 7 nights", text: "The Chichén Itzá tour was the highlight. Our advisor answered every question within minutes." },
  { name: "Jenna W.", city: "Calgary, AB", trip: "Saver · 3 nights", text: "Unbeatable for a long weekend escape from the cold. Clear pricing, no surprises at checkout." },
];
const gallery = [
  { src: gBeach, alt: "Couple walking along the beach in Cancun's Hotel Zone", caption: "Hotel Zone sunset walk" },
  { src: gChichen, alt: "Travellers in front of El Castillo at Chichén Itzá", caption: "Chichén Itzá day tour" },
  { src: gCenote, alt: "Swimmers in a turquoise cenote with sunbeams", caption: "Cenote swim near Tulum" },
  { src: gCatamaran, alt: "Friends on a catamaran sailing to Isla Mujeres", caption: "Isla Mujeres catamaran" },
];
const payBadges = ["VISA", "Mastercard", "AMEX", "Interac"];
import { classes, codeError, codes, entryTiers, fmt, paymentMethods, perks, quote, tiers, type Tier } from "@/lib/offers";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skyline Passage | Cancun Vacation Packages for Canadians" },
      { name: "description", content: "All-inclusive Cancun vacation packages tailored for Canadian travelers by Skyline Passage (skylinepassage.com). Economy, Premium Economy or Business Class flights from 50+ airports, 100% CAD pricing." },
      { property: "og:title", content: "Skyline Passage | Cancun Vacation Packages for Canadians" },
      { property: "og:description", content: "All-inclusive Cancun vacation packages tailored for Canadian travelers by Skyline Passage (skylinepassage.com). Flights from 50+ Canadian & international airports with 24/7 dedicated travel support." },
    ],
  }),
  component: Index,
});

// Placeholder number — replace with the real business WhatsApp number (digits only, with country code)
const WHATSAPP_NUMBER = "15555555555";

const airports: Record<string, string[]> = {
  Canada: ["Toronto Pearson (YYZ)", "Toronto Billy Bishop (YTZ)", "Montréal–Trudeau (YUL)", "Vancouver (YVR)", "Calgary (YYC)", "Edmonton (YEG)", "Ottawa (YOW)", "Winnipeg (YWG)", "Halifax Stanfield (YHZ)", "Québec City (YQB)", "Victoria (YYJ)", "Kelowna (YLW)", "Saskatoon (YXE)", "Regina (YQR)", "London ON (YXU)", "Hamilton (YHM)", "St. John's (YYT)", "Kitchener–Waterloo (YKF)", "Moncton (YQM)", "Thunder Bay (YQT)", "Windsor (YQG)", "Fredericton (YFC)", "Charlottetown (YYG)", "Abbotsford (YXX)"],
  "United States": ["New York JFK (JFK)", "Los Angeles (LAX)", "Chicago O'Hare (ORD)", "Seattle–Tacoma (SEA)", "Boston Logan (BOS)", "Miami (MIA)", "San Francisco (SFO)", "Dallas/Fort Worth (DFW)", "Atlanta (ATL)", "Denver (DEN)"],
  International: ["London Heathrow (LHR)", "Paris Charles de Gaulle (CDG)", "Frankfurt (FRA)", "Amsterdam Schiphol (AMS)", "Madrid–Barajas (MAD)", "Zurich (ZRH)", "Dublin (DUB)", "Rome Fiumicino (FCO)", "Dubai (DXB)", "Doha Hamad (DOH)", "Singapore Changi (SIN)", "Tokyo Haneda (HND)", "Hong Kong (HKG)", "Seoul Incheon (ICN)", "Sydney (SYD)", "Mexico City (MEX)", "Delhi (DEL)", "Mumbai (BOM)", "São Paulo (GRU)", "Istanbul (IST)"],
};

function useCountdown() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      setLeft(Math.max(0, end.getTime() - now.getTime()));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  if (left === null) return "--:--:--";
  const s = Math.floor(left / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
}

function TierCard({ t, active, onSelect }: { t: Tier; active: boolean; onSelect: () => void }) {
  const save = t.was ? t.was - t.price : 0;
  return (
    <button
      key={t.name}
      onClick={onSelect}
      className={`relative rounded-2xl border-2 bg-card p-7 text-left text-card-foreground transition ${active ? "border-primary shadow-xl" : "border-border hover:border-primary/40"}`}
    >
      {(t.badge || t.popular) && (
        <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
          {t.popular ? "Most popular" : t.badge}
        </span>
      )}
      <h3 className="text-2xl font-bold">{t.name}</h3>
      <p className="text-sm text-muted-foreground">{t.nights} nights</p>
      <p className="mt-5 text-4xl font-bold text-primary">
        {fmt(t.price)}
        <span className="text-base font-normal text-muted-foreground"> CAD</span>
      </p>
      {t.was && (
        <p className="mt-1 flex items-center gap-2 text-sm">
          <span className="text-muted-foreground line-through">{fmt(t.was)}</span>
          <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
            Save {fmt(save)}
          </span>
        </p>
      )}
      <ul className="mt-6 space-y-2.5 text-sm">
        {t.features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="text-primary">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <span className={`mt-7 block rounded-full py-2.5 text-center text-sm font-semibold ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
        {active ? "Selected" : "Select"}
      </span>
    </button>
  );
}

function Index() {
  const [tier, setTier] = useState("Standard");
  const [cls, setCls] = useState("Economy");
  const [airport, setAirport] = useState("Toronto Pearson (YYZ)");
  const [travellers, setTravellers] = useState(2);
  const [date, setDate] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const [codeHint, setCodeHint] = useState<string | null>(null);
  const [payment, setPayment] = useState("Card");
  const clock = useCountdown();

  const allTiers = [...entryTiers, ...tiers];
  const t = allTiers.find((x) => x.name === tier)!;
  const c = classes.find((x) => x.name === cls)!;
  const subtotal = (t.price + c.add) * travellers;

  const appliedError = applied ? codeError(applied, subtotal, travellers, date) : null;
  const activeCode = applied && !appliedError ? applied : null;
  const payMethod = paymentMethods.find((m) => m.name === payment) ?? paymentMethods[0];
  const q = quote(subtotal, activeCode, payMethod.name);
  const total = q.total;

  const msg = `Hi! I'd like to inquire about a Cancun vacation package with Skyline Passage (skylinepassage.com).\n• Package: ${tier}\n• Flight class: ${cls}\n• Departing from: ${airport}\n• Travellers: ${travellers}${date ? `\n• Travel date: ${date}` : ""}\n• Paying with: ${payMethod.name}${q.payment ? ` (special offer: ${fmt(q.payment)} CAD off)` : ""}${activeCode ? `\n• Discount code: ${activeCode} (saving ${fmt(q.code)} CAD)` : ""}\n• Estimated total: ${fmt(total)} CAD`;
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

  const applyCode = (key: string) => {
    const clean = key.trim().toUpperCase();
    setCodeInput(clean);
    const err = codeError(clean, subtotal, travellers, date);
    if (err) {
      setApplied(null);
      setCodeHint(err);
      return;
    }
    setApplied(clean);
    setCodeHint(null);
  };

  const field = "w-full rounded-lg border border-input bg-card px-3 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <main className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-foreground text-background">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-5 py-2 text-center text-xs font-semibold sm:text-sm">
          <span>⚡ All-Inclusive Cancun Packages for Canadian Travellers</span>
          <span className="opacity-40">|</span>
          <span>Flights from 50+ Airports</span>
          <span className="opacity-40">|</span>
          <span>10% off with Card or Interac</span>
          <span className="opacity-40">|</span>
          <span>
            Code{" "}
            <span className="rounded bg-background/15 px-1.5 py-0.5 font-mono">CANCUN200</span> = $200 off
          </span>
        </div>
      </div>

      <header className="sticky top-[36px] z-40 border-b border-border/30 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <a href="#" className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground transition hover:opacity-90">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm">
              ✈
            </span>
            <span className="font-serif text-xl font-bold tracking-tight md:text-2xl">Skyline Passage</span>
          </a>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-muted-foreground md:flex">
            <a href="#packages" className="transition hover:text-primary">Packages</a>
            <a href="#flights" className="transition hover:text-primary">Flights</a>
            <a href="#special-offers" className="transition hover:text-primary">Offers</a>
            <a href="#gallery" className="transition hover:text-primary">Moments</a>
            <a href="#reviews" className="transition hover:text-primary">Reviews</a>
            <a href="#plan" className="transition hover:text-primary">Plan Trip</a>
          </nav>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:scale-105"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.3.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3Z"/></svg>
            Inquire Now
          </a>
        </div>
      </header>

      <section className="relative flex min-h-[85vh] items-end overflow-hidden">
        <img src={hero} alt="Aerial view of Cancun's turquoise beach and resorts" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 text-primary-foreground">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-sand">🇨🇦 Made for Canadian travellers</p>
          <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] md:text-7xl">Trade the snow for Cancun sand.</h1>
          <p className="mt-5 max-w-xl text-lg opacity-90">
            Entry escapes from {fmt(249)} CAD, all-inclusive up to luxury suites with Skyline Passage. Flights from 50+ airports, prices in Canadian dollars, no surprises.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#entry" className="inline-block rounded-full bg-accent px-7 py-3.5 font-semibold text-accent-foreground transition hover:opacity-90">
              Grab an entry escape
            </a>
            <a href="#packages" className="inline-block rounded-full border border-primary-foreground/40 px-7 py-3.5 font-semibold transition hover:bg-primary-foreground/10">
              View all packages
            </a>
          </div>
        </div>
      </section>

      <section id="entry" className="scroll-mt-24 bg-foreground py-20 text-background">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Limited time · today only</p>
          <h2 className="mt-2 text-4xl font-bold md:text-5xl">Entry escapes from {fmt(249)}</h2>
          <p className="mt-3 max-w-2xl text-background/70">
            Short getaways at first-time-traveller prices. Same all-inclusive setup, same WhatsApp service — just fewer nights and promotional seats.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {entryTiers.map((x) => (
              <TierCard key={x.name} t={x} active={tier === x.name} onSelect={() => setTier(x.name)} />
            ))}
          </div>
          <p className="mt-6 text-xs text-background/60">
            Promotional fares on basic economy seats, subject to availability and blackout dates. Prices shown per person, based on double occupancy.
          </p>
        </div>
      </section>

      <section id="packages" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
        <h2 className="text-4xl font-bold md:text-5xl">Choose your escape</h2>
        <p className="mt-3 text-muted-foreground">Per person, based on double occupancy, Economy flights included.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {tiers.map((x) => (
            <TierCard key={x.name} t={x} active={tier === x.name} onSelect={() => setTier(x.name)} />
          ))}
        </div>
      </section>

      <section id="special-offers" className="scroll-mt-24 border-y border-border bg-primary/5 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Every package qualifies · applied at checkout</p>
          <h2 className="mt-2 text-4xl font-bold md:text-5xl">Special offers</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Choose how you'll settle your balance and the discount comes off your package total before you pay — entry escapes included.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {paymentMethods.map((m) => {
              const active = payment === m.name;
              const cut = quote(subtotal, null, m.name).payment;
              return (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => setPayment(m.name)}
                  className={`relative rounded-2xl border-2 bg-card p-7 text-left text-card-foreground transition ${active ? "border-primary shadow-xl" : "border-border hover:border-primary/40"}`}
                >
                  <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                    {Math.round(m.pct * 100)}% off
                  </span>
                  <h3 className="text-2xl font-bold">{m.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{m.methods}</p>
                  <p className="mt-5 text-3xl font-bold text-primary">{m.tagline}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{m.detail}</p>
                  <p className="mt-5 text-sm font-semibold">On your {tier} trip: save {fmt(cut)} CAD</p>
                  <span className={`mt-5 block rounded-full py-2.5 text-center text-sm font-semibold ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                    {active ? "Selected" : "Choose this"}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Payment offers apply to every package and stack with your discount code. All transactions are securely processed in Canadian Dollars (CAD) with confirmed airline and resort itineraries.
          </p>
        </div>
      </section>


      <section id="flights" className="scroll-mt-24 bg-sand/60 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-4xl font-bold md:text-5xl">Fly your way</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {classes.map((x) => (
              <button key={x.name} onClick={() => setCls(x.name)} className={`rounded-2xl border-2 bg-card p-6 text-left transition ${cls === x.name ? "border-primary" : "border-transparent"}`}>
                <h3 className="text-xl font-bold">{x.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{x.note}</p>
                <p className="mt-4 font-semibold text-primary">{x.add ? `+${fmt(x.add)} / person` : "Included"}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold md:text-5xl">Exclusive discounts</h2>
            <p className="mt-3 text-muted-foreground">Tap a code to drop it into your trip — it stacks on top of your payment offer below.</p>
            <div className="mt-8 space-y-4">
              {Object.entries(codes).map(([key, c2]) => {
                const active = activeCode === key;
                return (
                  <div key={key} className={`rounded-2xl border-2 bg-card p-6 transition ${active ? "border-primary" : "border-border"}`}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-mono text-lg font-bold tracking-wider text-primary">{key}</p>
                        <p className="mt-1 font-semibold">{c2.label}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{c2.note}</p>
                      </div>
                      <button
                        onClick={() => applyCode(key)}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-primary/10"}`}
                      >
                        {active ? "Applied ✓" : "Apply to my trip"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-bold md:text-5xl">Limited-time perks</h2>
            <p className="mt-3 text-muted-foreground">
              Included free with your inquiry today — <span className="font-semibold text-foreground tabular-nums">{clock}</span> left.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {perks.map((p) => (
                <div key={p.title} className="rounded-2xl border border-border bg-card p-6">
                  <span className="inline-block rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">{p.expiry}</span>
                  <h3 className="mt-3 text-lg font-bold leading-snug">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.detail}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              Perks are subject to resort availability and cannot be combined with group rates. Mention the perk in your WhatsApp message to lock it in.
            </p>
          </div>
        </div>
      </section>

      <section id="gallery" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Trip gallery</p>
        <h2 className="mt-2 text-4xl font-bold md:text-5xl">Moments from Cancun</h2>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {gallery.map((g) => (
            <figure key={g.caption} className="overflow-hidden rounded-2xl bg-card">
              <img src={g.src} alt={g.alt} loading="lazy" width={1024} height={768} className="aspect-[4/5] w-full object-cover transition duration-500 hover:scale-105" />
              <figcaption className="px-3 py-2 text-xs font-semibold text-muted-foreground">{g.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="reviews" className="scroll-mt-24 bg-sand/60 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Traveller reviews</p>
          <h2 className="mt-2 text-4xl font-bold md:text-5xl">Loved by Canadian travellers</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {reviews.map((r) => (
              <figure key={r.name} className="rounded-2xl border border-border bg-card p-6 text-card-foreground">
                <div className="text-lg tracking-widest text-accent" aria-label="5 out of 5 stars">★★★★★</div>
                <blockquote className="mt-3 text-sm leading-relaxed">“{r.text}”</blockquote>
                <figcaption className="mt-5 text-sm">
                  <span className="font-bold">{r.name}</span>
                  <span className="block text-muted-foreground">{r.city} · {r.trip}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="plan" className="mx-auto max-w-3xl scroll-mt-24 px-5 pb-20">
        <h2 className="text-4xl font-bold md:text-5xl">Plan your trip</h2>
        <div className="mt-8 grid gap-5 rounded-2xl border border-border bg-card p-6 md:grid-cols-2 md:p-8">
          <label className="md:col-span-2 text-sm font-semibold">Departure airport
            <select value={airport} onChange={(e) => setAirport(e.target.value)} className={`${field} mt-2 font-normal`}>
              {Object.entries(airports).map(([g, list]) => (
                <optgroup key={g} label={g}>{list.map((a) => <option key={a}>{a}</option>)}</optgroup>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">Package
            <select value={tier} onChange={(e) => setTier(e.target.value)} className={`${field} mt-2 font-normal`}>{allTiers.map((x) => <option key={x.name}>{x.name}</option>)}</select>
          </label>
          <label className="text-sm font-semibold">Flight class
            <select value={cls} onChange={(e) => setCls(e.target.value)} className={`${field} mt-2 font-normal`}>{classes.map((x) => <option key={x.name}>{x.name}</option>)}</select>
          </label>
          <label className="text-sm font-semibold">Travellers
            <input type="number" min={1} max={20} value={travellers} onChange={(e) => setTravellers(Math.max(1, Number(e.target.value) || 1))} className={`${field} mt-2 font-normal`} />
          </label>
          <label className="text-sm font-semibold">Travel date
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`${field} mt-2 font-normal`} />
          </label>
          <label className="md:col-span-2 text-sm font-semibold">Pay with
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {paymentMethods.map((m) => (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => setPayment(m.name)}
                  className={`rounded-lg border-2 px-4 py-3 text-left text-sm transition ${payment === m.name ? "border-primary bg-primary/5 font-semibold" : "border-input bg-card font-normal hover:border-primary/40"}`}
                >
                  {m.name}
                  <span className="block text-xs font-normal text-muted-foreground">{m.tagline}</span>
                </button>
              ))}
            </div>
          </label>
          <label className="md:col-span-2 text-sm font-semibold">Discount code
            <div className="mt-2 flex gap-3">
              <input
                value={codeInput}
                onChange={(e) => { setCodeInput(e.target.value.toUpperCase()); setCodeHint(null); }}
                placeholder="CANCUN200"
                className={`${field} font-mono font-normal tracking-wider`}
              />
              <button onClick={() => applyCode(codeInput)} className="shrink-0 rounded-lg bg-secondary px-5 text-sm font-semibold text-secondary-foreground transition hover:bg-primary/10">
                Apply
              </button>
            </div>
            {(codeHint || (applied && appliedError)) && <span className="mt-2 block text-sm text-destructive">{codeHint ?? appliedError}</span>}
            {activeCode && <span className="mt-2 block text-sm font-semibold text-primary">{activeCode} applied — you save {fmt(q.code)} CAD on top of your payment offer.</span>}
          </label>
          <div className="md:col-span-2 space-y-2 border-t border-border pt-5 text-sm">
            <div className="flex items-baseline justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{fmt(subtotal)} CAD</span>
            </div>
            {q.payment > 0 && (
              <div className="flex items-baseline justify-between font-semibold text-primary">
                <span>{payMethod.name} payment offer ({Math.round(payMethod.pct * 100)}%)</span>
                <span>−{fmt(q.payment)} CAD</span>
              </div>
            )}
            {q.code > 0 && (
              <div className="flex items-baseline justify-between font-semibold text-primary">
                <span>Discount ({activeCode})</span>
                <span>−{fmt(q.code)} CAD</span>
              </div>
            )}
            <div className="flex items-baseline justify-between border-t border-border pt-3">
              <span className="text-muted-foreground">Estimated total</span>
              <span className="text-3xl font-bold text-primary">{fmt(total)} CAD</span>
            </div>
          </div>
          <div className="md:col-span-2 rounded-xl border border-border bg-muted/50 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-primary" aria-hidden><path d="M12 1 3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4Zm0 6a3 3 0 0 1 3 3v1h1v6H8v-6h1v-1a3 3 0 0 1 3-3Zm0 2a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1Z"/></svg>
              Secure payments accepted
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {payBadges.map((b) => (
                <span key={b} className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-bold tracking-wide text-card-foreground">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-foreground px-5 py-20 text-center text-background">
        <h2 className="text-4xl font-bold md:text-5xl">Ready for Cancun?</h2>
        <p className="mx-auto mt-4 max-w-md opacity-80">
          Send us your trip details and a travel advisor will reply within minutes — your {payMethod.name.toLowerCase()} payment offer ({fmt(q.payment)} CAD off) is already built into the estimate above.
        </p>
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-3 rounded-full bg-whatsapp px-8 py-4 text-lg font-bold text-primary-foreground transition hover:scale-105">
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.3.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3Z"/></svg>
          Inquire on WhatsApp
        </a>
        <p className="mt-5 text-xs opacity-60">Fast response via WhatsApp · Dedicated Canadian travel specialists · 100% CAD pricing.</p>
      </section>

      <footer className="border-t border-border/20 bg-foreground py-12 text-background/80">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center gap-2 text-xl font-bold text-background md:justify-start">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-xs font-bold text-accent-foreground">✈</span>
                <span className="font-serif text-2xl font-bold">Skyline Passage</span>
              </div>
              <p className="mt-1.5 text-xs text-background/60">
                skylinepassage.com · Curated Cancun vacation packages for Canadian travellers.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-xs font-medium text-background/70">
              <a href="#packages" className="transition hover:text-background">Packages</a>
              <a href="#flights" className="transition hover:text-background">Flight Classes</a>
              <a href="#special-offers" className="transition hover:text-background">Special Offers</a>
              <a href="#gallery" className="transition hover:text-background">Trip Gallery</a>
              <a href="#reviews" className="transition hover:text-background">Reviews</a>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="transition hover:text-background">WhatsApp Us</a>
            </div>
          </div>
          <div className="mt-8 border-t border-background/10 pt-6 text-center text-xs text-background/50">
            <p>© {new Date().getFullYear()} Skyline Passage (skylinepassage.com). All rights reserved. Prices quoted in Canadian Dollars (CAD).</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
