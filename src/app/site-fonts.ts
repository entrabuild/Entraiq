import { Cormorant_Garamond } from "next/font/google";

/** Royal display face for the public website's headings (the platform keeps its own type). */
export const royalFont = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-royal", display: "swap" });
export const ROYAL = `royal ${royalFont.variable}`;
