/** Single source of truth for product branding. Change here (or in Settings → Brand at runtime). */
export const BRAND_DEFAULTS = {
  company: "ENTRAIOT SOLUTIONS",
  companyLegal: "ENTRAIOT SOLUTIONS PRIVATE LIMITED",
  productName: "ENTRAIQ",
  tagline: "Marketplace Intelligence Platform",
  accent: "indigo" as "indigo" | "violet" | "teal",
};
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
export const DEMO_NOTICE = "Sample data — not connected to live marketplace accounts.";
