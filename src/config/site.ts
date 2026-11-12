/**
 * PUBLIC WEBSITE SETTINGS — edit this one file to change contacts, social links, numbers and portfolio.
 * Anything left empty ("") is hidden on the site automatically. Never put numbers here that are not real.
 */
export const SITE = {
  /** Full public address of the site, used for SEO (sitemap, canonical links, social previews). */
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://entrabuild.com",
  company: "ENTRAIOT SOLUTIONS PRIVATE LIMITED",
  brandLine: "ENTRAIQ by Entraiot Solutions",

  contact: {
    email: "reach@entrabuild.com",
    phones: ["+91 81245 45524", "+91 99444 42061"],
    /** Digits only, with country code. Used for the WhatsApp button and the sticky bar. */
    whatsapp: "918124545524",
    whatsappChannel: "", // e.g. https://whatsapp.com/channel/...
  },

  location: {
    city: "Chennai, Tamil Nadu, India",
    address: "", // full office address — shown in the footer and used for SEO when filled
    mapUrl: "", // Google Maps link
  },

  /** Social pages. Each icon appears only when its link is filled in. */
  social: {
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    x: "",
  },

  /** Real numbers only. A stat with an empty value is hidden. */
  stats: [
    { value: "", label: "Brands supported" },
    { value: "", label: "Average lead growth" },
    { value: "", label: "Projects delivered" },
  ],

  /** Real client projects. Confirm each client is happy to be listed. "url" empty = no Visit link. */
  portfolio: [
    { name: "Nordic Affairs Media", place: "Sweden", work: "Website rebuild with a ticket booking platform", tags: ["Next.js", "Booking", "Chatbot"], url: "https://nordicaffairsmedia.com", hue: 212 },
    { name: "Pavana Silks", place: "Tamil Nadu", work: "Cinematic scroll-driven brand website and social media management", tags: ["Brand site", "Social media"], url: "https://pavanasilks.com", hue: 345 },
    { name: "TNWLA Madras", place: "Chennai", work: "Website for the Tamilnadu Women Law Association", tags: ["Website", "Association"], url: "https://tnwla-madras.com", hue: 268 },
  ],
} as const;

export const telHref = (p: string) => `tel:${p.replace(/[^+\d]/g, "")}`;
export const waHref = (text?: string) => `https://wa.me/${SITE.contact.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
export const socialLinks = () => (Object.entries(SITE.social) as [keyof typeof SITE.social, string][]).filter(([, u]) => u);
export const realStats = () => SITE.stats.filter((s) => s.value.trim());
