"use client";
import { Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { BrandMark } from "@/components/shell/sidebar";
import { Button } from "@/components/ui";
import { BRAND_DEFAULTS, DEMO_NOTICE } from "@/config/brand";
import { useStore } from "@/lib/store";

const LINKS = [
  ["#how", "How it works"],
  ["#platform", "Platform"],
  ["#listing-check", "Free listing check"],
  ["#pricing", "Pricing"],
  ["#faq", "FAQ"],
] as const;

export function SiteHeader() {
  const theme = useStore((s) => s.theme);
  const set = useStore((s) => s.set);
  const [open, setOpen] = React.useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-15 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label={`${BRAND_DEFAULTS.productName} home`}>
          <BrandMark size={28} />
          <span className="text-[15px] font-semibold tracking-tight">{BRAND_DEFAULTS.productName}</span>
        </Link>
        <nav className="ml-4 hidden items-center gap-5 md:flex" aria-label="Site">
          {LINKS.map(([href, label]) => <a key={href} href={href} className="text-[13px] text-muted hover:text-ink">{label}</a>)}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"} onClick={() => set({ theme: theme === "dark" ? "light" : "dark" })}>{theme === "dark" ? <Sun /> : <Moon />}</Button>
          <Link href="/login" className="hidden h-8.5 items-center rounded-md px-3 text-[13px] font-medium text-muted hover:bg-raised hover:text-ink sm:inline-flex">Log in</Link>
          <Link href="/signup" className="hidden h-8.5 items-center rounded-md bg-accent px-3 text-[13px] font-medium text-accent-ink hover:brightness-110 sm:inline-flex">Start free workspace</Link>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-line px-4 py-3 md:hidden" aria-label="Site mobile">
          <ul className="space-y-1">
            {LINKS.map(([href, label]) => <li key={href}><a href={href} onClick={() => setOpen(false)} className="block rounded-md px-2 py-2 text-[14px] hover:bg-raised">{label}</a></li>)}
            <li><Link href="/login" className="block rounded-md px-2 py-2 text-[14px] hover:bg-raised">Log in</Link></li>
            <li><Link href="/signup" className="mt-1 block rounded-md bg-accent px-2 py-2 text-center text-[14px] font-medium text-accent-ink">Start free workspace</Link></li>
          </ul>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2"><BrandMark size={24} /><span className="font-semibold">{BRAND_DEFAULTS.productName}</span></div>
          <p className="mt-2 max-w-sm text-[13px] text-muted">{BRAND_DEFAULTS.tagline} for marketplace agencies. Built and run by {BRAND_DEFAULTS.companyLegal}, {BRAND_DEFAULTS.city}.</p>
          <p className="mt-3 text-[12px] text-faint">The product demo uses sample data. {DEMO_NOTICE}</p>
        </div>
        <div className="text-[13px]">
          <p className="font-medium">Product</p>
          <ul className="mt-2 space-y-1.5 text-muted">
            <li><a href="#platform" className="hover:text-ink">Platform</a></li>
            <li><a href="#pricing" className="hover:text-ink">Pricing</a></li>
            <li><Link href="/login" className="hover:text-ink">Try the demo workspace</Link></li>
          </ul>
        </div>
        <div className="text-[13px]">
          <p className="font-medium">Contact</p>
          <ul className="mt-2 space-y-1.5 text-muted">
            <li className="select-all">{BRAND_DEFAULTS.contactEmail}</li>
            <li><a href="#demo" className="hover:text-ink">Request a demo</a></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-line px-4 py-4 text-center text-[12px] text-faint">© {new Date().getFullYear()} {BRAND_DEFAULTS.companyLegal}. Amazon, Flipkart, Myntra and Meta are trademarks of their owners; ENTRAIQ is not affiliated with or endorsed by them.</p>
    </footer>
  );
}
