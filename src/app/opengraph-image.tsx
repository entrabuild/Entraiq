import { ImageResponse } from "next/og";

export const alt = "Entraiot — websites, marketing and the ENTRAIQ marketplace platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The preview card shown when the site is shared on WhatsApp, LinkedIn, Facebook or X. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg, #1d2a8f 0%, #3d55f0 45%, #6f47e0 100%)", color: "white", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "white", color: "#3d55f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 800 }}>E</div>
          <div style={{ display: "flex", flexDirection: "column" }}><span style={{ fontSize: 34, fontWeight: 700 }}>ENTRAIQ</span><span style={{ fontSize: 22, opacity: 0.8 }}>by Entraiot Solutions</span></div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05 }}>Build your brand. Sell more online.</span>
          <span style={{ fontSize: 30, opacity: 0.85 }}>E-commerce websites · SEO · Social media · Marketplace platform</span>
        </div>
        <span style={{ fontSize: 24, opacity: 0.8 }}>reach@entrabuild.com · +91 81245 45524</span>
      </div>
    ),
    size,
  );
}
