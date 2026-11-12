/**
 * Free listing check — a rules-based review of a product listing's text.
 * It is a heuristic guide built from common marketplace listing guidelines, NOT a marketplace's own
 * quality score, and it does not fetch or read any live listing. The UI must say so.
 */
export type Marketplace = "amazon" | "flipkart" | "myntra";
export interface ListingInput {
  marketplace: Marketplace;
  title: string;
  bullets: string; // one point per line
  description: string;
  imageCount: number;
  whiteMainImage: boolean;
}
export type Severity = "pass" | "warn" | "fail";
export interface CheckResult { id: string; label: string; severity: Severity; detail: string; fix?: string; weight: number }
export interface ListingReport { score: number; grade: "Strong" | "Needs work" | "Weak"; results: CheckResult[]; method: string }

const LIMITS: Record<Marketplace, { titleMax: number; titleIdeal: [number, number]; bulletsIdeal: number; imagesIdeal: number }> = {
  amazon: { titleMax: 200, titleIdeal: [60, 150], bulletsIdeal: 5, imagesIdeal: 6 },
  flipkart: { titleMax: 150, titleIdeal: [50, 120], bulletsIdeal: 5, imagesIdeal: 5 },
  myntra: { titleMax: 120, titleIdeal: [30, 90], bulletsIdeal: 4, imagesIdeal: 5 },
};
export const MARKETPLACE_LABEL: Record<Marketplace, string> = { amazon: "Amazon", flipkart: "Flipkart", myntra: "Myntra" };

const PROMO = ["best", "cheapest", "free", "sale", "offer", "discount", "deal", "#1", "no.1", "number one", "100%", "guaranteed", "hot", "top rated", "limited time"];
const SYMBOLS = /[!$?*~^{}¬¦]/;
const STOP = new Set(["and", "for", "with", "the", "of", "in", "to", "a", "an", "&", "-", "|", "/", "on", "by"]);

const words = (s: string) => s.toLowerCase().split(/[^\p{L}\p{N}#%.]+/u).filter(Boolean);
const lines = (s: string) => s.split(/\r?\n/).map((l) => l.replace(/^[\s•*\-–·]+/, "").trim()).filter(Boolean);

export function checkListing(input: ListingInput): ListingReport {
  const L = LIMITS[input.marketplace];
  const mk = MARKETPLACE_LABEL[input.marketplace];
  const title = input.title.trim().replace(/\s+/g, " ");
  const bullets = lines(input.bullets);
  const desc = input.description.trim();
  const r: CheckResult[] = [];

  // 1. Title length
  const tl = title.length;
  r.push(
    tl === 0 ? { id: "title-length", label: "Title length", severity: "fail", detail: "No title entered.", fix: "Add a title that names the brand, product type and key detail.", weight: 15 }
    : tl > L.titleMax ? { id: "title-length", label: "Title length", severity: "fail", detail: `${tl} characters — over the ${L.titleMax}-character guideline for ${mk}.`, fix: `Cut it to ${L.titleIdeal[1]} characters or fewer; move extra detail into the bullet points.`, weight: 15 }
    : tl < L.titleIdeal[0] ? { id: "title-length", label: "Title length", severity: "warn", detail: `${tl} characters — short for ${mk}; shoppers search on details you may be leaving out.`, fix: "Add size, colour, material or pack quantity.", weight: 15 }
    : tl > L.titleIdeal[1] ? { id: "title-length", label: "Title length", severity: "warn", detail: `${tl} characters — allowed, but long titles are cut off on mobile.`, fix: `Keep the most important words in the first ${Math.min(80, L.titleIdeal[1])} characters.`, weight: 15 }
    : { id: "title-length", label: "Title length", severity: "pass", detail: `${tl} characters — within the ${L.titleIdeal[0]}–${L.titleIdeal[1]} range that reads well for ${mk}.`, weight: 15 },
  );

  // 2. Promotional words
  const lowerTitle = ` ${title.toLowerCase()} `;
  const promo = PROMO.filter((p) => lowerTitle.includes(` ${p} `) || (p.startsWith("#") || p.endsWith("%") ? lowerTitle.includes(p) : false));
  r.push(promo.length
    ? { id: "promo", label: "No sales claims in title", severity: "fail", detail: `Contains: ${promo.map((p) => `"${p}"`).join(", ")}. Marketplaces commonly disallow promotional claims in titles.`, fix: "Remove offer and ranking words; put offers in the deal or coupon tools.", weight: 12 }
    : { id: "promo", label: "No sales claims in title", severity: tl ? "pass" : "warn", detail: tl ? "No promotional words found." : "Enter a title to check.", weight: 12 });

  // 3. Symbols and capitals
  const letters = title.replace(/[^A-Za-z]/g, "");
  const capsShare = letters.length ? letters.replace(/[^A-Z]/g, "").length / letters.length : 0;
  const symbol = SYMBOLS.test(title);
  r.push(symbol || (letters.length > 12 && capsShare > 0.6)
    ? { id: "format", label: "Clean formatting", severity: "warn", detail: [symbol ? "Uses symbols such as ! $ ? *" : "", capsShare > 0.6 && letters.length > 12 ? "Mostly in CAPITAL letters" : ""].filter(Boolean).join("; ") + ".", fix: "Use normal capitalisation and drop decorative symbols.", weight: 8 }
    : { id: "format", label: "Clean formatting", severity: tl ? "pass" : "warn", detail: tl ? "Normal capitalisation, no decorative symbols." : "Enter a title to check.", weight: 8 });

  // 4. Keyword stuffing
  const counts = new Map<string, number>();
  for (const w of words(title)) if (w.length > 2 && !STOP.has(w)) counts.set(w, (counts.get(w) ?? 0) + 1);
  const repeated = [...counts].filter(([, c]) => c >= 3).map(([w]) => w);
  r.push(repeated.length
    ? { id: "stuffing", label: "No repeated keywords", severity: "warn", detail: `Repeated 3+ times: ${repeated.join(", ")}.`, fix: "Use each search word once; add synonyms in the bullets or backend search terms instead.", weight: 8 }
    : { id: "stuffing", label: "No repeated keywords", severity: tl ? "pass" : "warn", detail: tl ? "No word repeated three or more times." : "Enter a title to check.", weight: 8 });

  // 5. Specifics in title (a number: size, quantity, capacity)
  const hasSpec = /\d/.test(title);
  r.push({ id: "specifics", label: "Key detail in title", severity: hasSpec ? "pass" : "warn", detail: hasSpec ? "Includes a size, quantity or measurement." : "No size, quantity, capacity or count found.", fix: hasSpec ? undefined : "Add the detail shoppers filter on, e.g. 500 ml, Pack of 2, Size M.", weight: 7 });

  // 6. Bullet points
  const short = bullets.filter((b) => b.length < 25).length;
  const long = bullets.filter((b) => b.length > 250).length;
  r.push(bullets.length === 0
    ? { id: "bullets", label: "Key feature points", severity: "fail", detail: "No feature points entered.", fix: `Write ${L.bulletsIdeal} short points: benefit first, then the detail.`, weight: 18 }
    : bullets.length < L.bulletsIdeal - 1 ? { id: "bullets", label: "Key feature points", severity: "warn", detail: `${bullets.length} of ${L.bulletsIdeal} suggested points.`, fix: "Add points on material, size/fit, use, care and what's in the box.", weight: 18 }
    : short || long ? { id: "bullets", label: "Key feature points", severity: "warn", detail: `${bullets.length} points; ${short ? `${short} too short` : ""}${short && long ? ", " : ""}${long ? `${long} too long` : ""}.`, fix: "Aim for 1–2 sentences (about 60–200 characters) per point.", weight: 18 }
    : { id: "bullets", label: "Key feature points", severity: "pass", detail: `${bullets.length} points of a readable length.`, weight: 18 });

  // 7. Description
  r.push(desc.length >= 300
    ? { id: "description", label: "Product description", severity: "pass", detail: `${desc.length} characters.`, weight: 12 }
    : { id: "description", label: "Product description", severity: desc.length ? "warn" : "fail", detail: desc.length ? `${desc.length} characters — thin.` : "No description entered.", fix: "Write at least 300 characters on who it's for, how to use it and why it's different.", weight: 12 });

  // 8. Images
  const imgs = Math.max(0, Math.floor(input.imageCount || 0));
  r.push(imgs >= L.imagesIdeal
    ? { id: "images", label: "Number of images", severity: "pass", detail: `${imgs} images.`, weight: 12 }
    : { id: "images", label: "Number of images", severity: imgs >= 3 ? "warn" : "fail", detail: `${imgs} image${imgs === 1 ? "" : "s"}; ${L.imagesIdeal}+ suggested for ${mk}.`, fix: "Add close-ups, the product in use, a size reference and the packaging.", weight: 12 });

  // 9. Main image background
  r.push(input.whiteMainImage
    ? { id: "main-image", label: "Plain main image", severity: "pass", detail: "Main image is on a plain white background.", weight: 8 }
    : { id: "main-image", label: "Plain main image", severity: "warn", detail: "Main image may not be on a plain white background.", fix: "Use a white-background main image; keep lifestyle shots for later images.", weight: 8 });

  const total = r.reduce((a, c) => a + c.weight, 0);
  const got = r.reduce((a, c) => a + (c.severity === "pass" ? c.weight : c.severity === "warn" ? c.weight * 0.5 : 0), 0);
  const score = Math.round((got / total) * 100);
  return {
    score,
    grade: score >= 80 ? "Strong" : score >= 55 ? "Needs work" : "Weak",
    results: r,
    method: `Rules-based check of the text you entered against common ${mk} listing guidelines. Pass = full points, warning = half, fail = none. It is a guide, not ${mk}'s own quality score, and no live listing is read.`,
  };
}
