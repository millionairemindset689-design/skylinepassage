// Offer + pricing data for the Cancun landing page.
// Prices are placeholders until the business confirms real rates.
// Entry-level packages: promotional fares that must sit in the $200–$400 CAD band.
export const entryTiers = [
  {
    name: "Saver",
    price: 249,
    was: 449,
    nights: 3,
    badge: "Flash deal · 8 seats left",
    features: [
      "3★ beachfront resort, all-inclusive",
      "Economy return flights included",
      "Shared airport transfers",
      "Pool, beach & evening shows",
      "24/7 travel support",
    ],
  },
  {
    name: "Escape",
    price: 399,
    was: 699,
    nights: 4,
    badge: "Ends tonight",
    features: [
      "4★ resort, all-inclusive",
      "Economy return flights included",
      "Return airport transfers",
      "Chichén Itzá or Tulum half-day tour",
      "Free date change",
    ],
  },
];
export const tiers = [
  {
    name: "Basic",
    price: 1299,
    was: 1599,
    nights: 5,
    features: [
      "4★ resort, all-inclusive",
      "Return airport transfers",
      "Beach & pool access",
      "24/7 travel support",
    ],
  },
  {
    name: "Standard",
    price: 1899,
    was: 2299,
    nights: 7,
    popular: true,
    features: [
      "5★ resort, all-inclusive",
      "Private transfers",
      "Chichén Itzá day tour",
      "Ocean-view room",
      "Free cancellation",
    ],
  },
  {
    name: "Premium",
    price: 3499,
    was: 4199,
    nights: 7,
    features: [
      "Luxury adults-only suite",
      "Butler & concierge service",
      "Isla Mujeres catamaran cruise",
      "Spa credit $300",
      "Airport lounge access",
    ],
  },
];
export const classes = [
  { name: "Economy", add: 0, note: "Standard seat, carry-on included" },
  { name: "Premium Economy", add: 450, note: "Extra legroom, priority boarding" },
  { name: "Business Class", add: 1400, note: "Lie-flat comfort, lounge, 2 bags" },
];
export const codes = {
  CANCUN200: {
    label: "$200 off any package",
    kind: "flat",
    value: 200,
    note: "Stacks with entry-level flash pricing. One use per booking.",
  },
  EARLYBIRD: {
    label: "10% off when you book 45+ days ahead",
    kind: "pct",
    value: 0.1,
    minLeadDays: 45,
    note: "Add a travel date at least 45 days out to unlock it.",
  },
  SNOWBIRD: {
    label: "15% off groups of 6 or more",
    kind: "pct",
    value: 0.15,
    minTravellers: 6,
    note: "For families, friend groups and condo crews.",
  },
};
export const perks = [
  {
    title: "Free Premium Economy upgrade",
    detail: "First 10 bookings this week",
    expiry: "This week",
  },
  { title: "$100 spa credit", detail: "Standard & Premium packages", expiry: "Ends Sunday" },
  {
    title: "Kids under 6 fly & stay free",
    detail: "On Saver & Escape packages",
    expiry: "Ends tonight",
  },
  {
    title: "Ocean-view room upgrade",
    detail: "At check-in, subject to availability",
    expiry: "First 20 trips",
  },
];
export const fmt = (n) =>
  n.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
// Days between today and the travel date; null when the date is missing or unreadable.
export function leadDays(date, today = new Date()) {
  if (!date) return null;
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - start.getTime()) / 86400000);
}
export function codeError(key, subtotal, travellers, date, today = new Date()) {
  const c = codes[key];
  if (!c) return "That code isn't valid.";
  if (c.minTravellers && travellers < c.minTravellers)
    return `${key} needs ${c.minTravellers}+ travellers.`;
  if (c.minLeadDays) {
    const days = leadDays(date, today);
    if (days === null) return `Add a travel date to use ${key}.`;
    if (days < c.minLeadDays) return `${key} needs a travel date ${c.minLeadDays}+ days out.`;
  }
  if (subtotal <= 0) return "Pick a package first.";
  return null;
}
export function discountFor(key, subtotal) {
  const c = codes[key];
  if (!c) return 0;
  return c.kind === "flat" ? Math.min(c.value, subtotal) : Math.round(subtotal * c.value);
}
export const paymentMethods = [
  {
    name: "Interac e-Transfer",
    pct: 0.1,
    tagline: "10% off every package",
    detail: "Pay via Canadian Interac e-Transfer and 10% comes off the package total at checkout.",
    methods: "All Canadian Banks · Fast & Direct",
  },
  {
    name: "Card",
    pct: 0.1,
    tagline: "10% off every package",
    detail: "Pay by card at checkout and 10% comes off the package total.",
    methods: "Visa · Mastercard · American Express",
  },
];
export function paymentDiscount(method, subtotal) {
  const m = paymentMethods.find((x) => x.name === method);
  if (!m || subtotal <= 0) return 0;
  return Math.min(subtotal, Math.round(subtotal * m.pct));
}
export function quote(subtotal, code, payment) {
  const paymentCut = paymentDiscount(payment, subtotal);
  const afterPayment = Math.max(0, subtotal - paymentCut);
  const codeCut = code ? Math.min(afterPayment, discountFor(code, afterPayment)) : 0;
  const discount = paymentCut + codeCut;
  return { payment: paymentCut, code: codeCut, discount, total: Math.max(0, subtotal - discount) };
}
