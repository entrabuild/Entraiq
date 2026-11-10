import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { BRAND_DEFAULTS } from "@/config/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: `${BRAND_DEFAULTS.productName} — ${BRAND_DEFAULTS.tagline}`,
  description: `${BRAND_DEFAULTS.productName} by ${BRAND_DEFAULTS.company}: marketplace, advertising and AI intelligence in one workspace. Demo environment with sample data.`,
};

// Applies the saved theme before first paint so the page never flashes the wrong colours.
const themeScript = `try{var s=JSON.parse(localStorage.getItem("entraiq-demo-v1")||"{}").state||{};var e=document.documentElement;if((s.theme||"dark")==="dark")e.classList.add("dark");if(s.brand&&s.brand.accent)e.dataset.accent=s.brand.accent}catch(e){document.documentElement.classList.add("dark")}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
