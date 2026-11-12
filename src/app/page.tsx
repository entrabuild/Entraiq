import { ArrowRight, Bell, Building2, Check, FileText, Gauge, LayoutDashboard, Megaphone, Palette, ScanSearch, Sparkles, Store, Upload, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DemoForm } from "@/components/site/demo-form";
import { FeeCalculator } from "@/components/site/fee-calculator";
import { ListingChecker } from "@/components/site/listing-checker";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { BRAND_DEFAULTS } from "@/config/brand";
import { PRICING } from "@/lib/site/pricing";

export const metadata: Metadata = {
  title: `${BRAND_DEFAULTS.productName} — the operating platform for marketplace agencies`,
  description: "Run every seller you manage on Amazon, Flipkart, Myntra and Meta from one workspace: dashboards, listing checks, AI insights, creatives and branded reports.",
};

const STEPS = [
  { icon: Building2, title: "Open your agency workspace", body: "Sign up and your workspace is ready in a minute, under your agency's name and logo." },
  { icon: Users, title: "Add the sellers you manage", body: "Each seller gets its own space. Assign account managers and decide what each person can do." },
  { icon: Upload, title: "Bring in their numbers", body: "Upload the sales and ads reports from each marketplace today. Live connections switch on as each marketplace approves access." },
  { icon: FileText, title: "Work, then report", body: "Fix listings, adjust ads, act on alerts, and send every seller a branded monthly report." },
];

const MODULES = [
  { icon: LayoutDashboard, title: "Agency overview", body: "Revenue, orders, ad spend, ROAS, ACOS and TACOS for every seller on one screen.", status: "live-demo" },
  { icon: Store, title: "Amazon & Flipkart", body: "Sales trends, products, inventory and ads per seller account.", status: "live-demo" },
  { icon: Store, title: "Myntra", body: "The same views for fashion and lifestyle sellers.", status: "rollout" },
  { icon: Megaphone, title: "Meta Ads", body: "Campaigns, ad sets and ads with create, edit, pause and resume.", status: "live-demo" },
  { icon: Sparkles, title: "AI insights", body: "Budget, product and campaign suggestions that show the numbers behind them.", status: "live-demo" },
  { icon: ScanSearch, title: "Listing quality check", body: "Scores titles, points, descriptions and images, with the fix for each.", status: "live-demo" },
  { icon: Palette, title: "Creative Studio", body: "Make ad and listing creatives from templates with each seller's brand kit.", status: "live-demo" },
  { icon: FileText, title: "Branded reports", body: "Monthly PDF and CSV reports with your agency's logo.", status: "live-demo" },
  { icon: Users, title: "Team & seller logins", body: "Roles for admins, managers and analysts; optional view-only seller logins.", status: "live-demo" },
] as const;

const AUTOMATIONS = [
  { icon: Bell, title: "Alerts that find you", body: "Low stock, a sudden ROAS drop or wasted ad spend raise an alert for the account manager." },
  { icon: FileText, title: "Reports that send themselves", body: "Pick the day; each seller's report is built from their numbers and sent on schedule." },
  { icon: ScanSearch, title: "Listing checks on every product", body: "New and changed listings are checked against marketplace guidelines and flagged." },
  { icon: Gauge, title: "Weekly AI summary", body: "Each Monday, a short note per seller: what moved, why, and what to do next." },
];

const CONNECTIONS = [
  ["Meta Ads", "First live connection, in rollout phase 3", "Report upload and demo data today"],
  ["Amazon (Seller Central & Ads)", "Live once Amazon approves our developer registration", "Report upload"],
  ["Flipkart", "Live when partner API access is granted", "Report upload"],
  ["Myntra", "Live when partner API access is granted", "Report upload"],
] as const;

const FAQ = [
  ["Do my sellers have to move their shops?", "No. Sellers keep selling on Amazon, Flipkart and Myntra exactly as they do now. ENTRAIQ is your agency's back office: their numbers come to you, their shops stay where they are."],
  ["Who logs in?", "Your agency team logs in every day. Sellers can have an optional view-only login to see their own numbers, or simply receive the monthly report."],
  ["How does seller data get in?", "Today, by uploading the standard reports each marketplace lets you download. As each marketplace approves API access, that seller's data starts flowing in automatically after the seller clicks Allow on the marketplace's own page. We never ask for seller passwords."],
  ["Can each agency's data be seen by another?", "No. Every agency has its own walled-off workspace, and every seller's data sits inside its agency's workspace only."],
  ["Is the AI making decisions for me?", "No. ENTRAIQ suggests; your team decides. Every suggestion shows the figures and the rule behind it."],
  ["What happens if I stop?", "After the minimum term you can stop with a month's notice and export all your data as files."],
] as const;

function SectionHead({ id, eyebrow, title, body }: { id?: string; eyebrow: string; title: string; body?: string }) {
  return (
    <div id={id} className="max-w-2xl scroll-mt-20">
      <p className="text-[12px] font-semibold tracking-wide text-accent">{eyebrow}</p>
      <h2 className="mt-1.5 text-[26px] leading-tight font-semibold text-balance sm:text-[32px]">{title}</h2>
      {body && <p className="mt-3 text-[15px] text-muted">{body}</p>}
    </div>
  );
}

function HeroPreview() {
  const rows = [
    ["Seller A · Home & kitchen", "Amazon, Flipkart", "4.6×", "ok"],
    ["Seller B · Sarees", "Myntra, Meta", "1.3×", "warn"],
    ["Seller C · Personal care", "Amazon, Meta", "3.1×", "ok"],
  ] as const;
  return (
    <div className="min-w-0 rounded-xl border border-line bg-surface p-4 shadow-card" aria-label="Sample agency overview">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold">Agency overview</p>
        <span className="rounded-md bg-warn-soft px-1.5 py-0.5 text-[11px] font-medium text-warn">Sample data</span>
      </div>
      <div className="tnum mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[["Sellers", "24"], ["Revenue, 30d", "₹38.6L"], ["Ad spend", "₹4.1L"], ["ROAS", "4.2×"]].map(([k, v]) => (
          <div key={k} className="rounded-lg bg-raised px-3 py-2"><p className="text-[11.5px] text-muted">{k}</p><p className="text-[17px] font-semibold">{v}</p></div>
        ))}
      </div>
      <ul className="mt-3 divide-y divide-line text-[12.5px]">
        {rows.map(([n, m, r, s]) => (
          <li key={n} className="flex items-center justify-between gap-3 py-2">
            <span className="min-w-0"><span className="block truncate font-medium">{n}</span><span className="text-faint">{m}</span></span>
            <span className={s === "warn" ? "tnum shrink-0 rounded-md bg-neg-soft px-1.5 py-0.5 font-medium text-neg" : "tnum shrink-0 text-muted"}>ROAS {r}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 flex items-start gap-1.5 rounded-md bg-ai-soft px-2.5 py-2 text-[12px] text-ai"><Sparkles className="mt-0.5 size-3.5 shrink-0" />Seller B: Meta ROAS fell below 1.5× this week. Suggest moving ₹6,000/day to the best-performing ad set.</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[12px] text-muted">For marketplace agencies · Amazon · Flipkart · Myntra · Meta</p>
            <h1 className="mt-4 text-[36px] leading-[1.08] font-semibold tracking-tight text-balance sm:text-[48px]">Run every seller you manage from one screen.</h1>
            <p className="mt-4 max-w-xl text-[16px] text-muted">ENTRAIQ is the operating platform for agencies that grow sellers on Indian marketplaces. See every account&apos;s sales and ads together, fix listings faster, act on alerts, and send reports that carry your brand.</p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <Link href="/signup" className="inline-flex h-10 items-center gap-1.5 rounded-md bg-accent px-4 text-[14px] font-medium text-accent-ink hover:brightness-110">Start free workspace<ArrowRight className="size-4" /></Link>
              <a href="#demo" className="inline-flex h-10 items-center rounded-md border border-line bg-surface px-4 text-[14px] font-medium hover:bg-raised">Book a demo</a>
              <Link href="/login" className="inline-flex h-10 items-center rounded-md px-3 text-[14px] font-medium text-muted hover:text-ink">Explore the demo workspace</Link>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-muted">
              {["Your agency's name and logo", "Pay per seller you manage", "Your data exportable any time"].map((t) => <li key={t} className="flex items-center gap-1.5"><Check className="size-4 text-pos" />{t}</li>)}
            </ul>
          </div>
          <HeroPreview />
        </section>

        {/* Who does what */}
        <section className="border-y border-line bg-surface">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-3">
            {[
              ["Sellers keep their shops", "Their products stay on Amazon, Flipkart and Myntra. Nothing moves."],
              ["Your team does the work", "Listings, ads, account care and reports — all from ENTRAIQ."],
              ["We run the platform", `${BRAND_DEFAULTS.company} builds, hosts, secures and updates it. We never contact your sellers.`],
            ].map(([t, b]) => <div key={t}><p className="text-[15px] font-semibold">{t}</p><p className="mt-1 text-[14px] text-muted">{b}</p></div>)}
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead id="how" eyebrow="HOW IT WORKS" title="From sign-up to first report in four steps" />
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-xl border border-line bg-surface p-5">
                <div className="flex items-center gap-2"><span className="tnum flex size-6 items-center justify-center rounded-full bg-accent-soft text-[12px] font-semibold text-accent">{i + 1}</span><s.icon className="size-4 text-muted" /></div>
                <p className="mt-3 text-[15px] font-semibold">{s.title}</p>
                <p className="mt-1 text-[13.5px] text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Platform */}
        <section className="bg-surface/60 border-y border-line">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <SectionHead id="platform" eyebrow="PLATFORM" title="Everything an agency does each day, in one place" body="Modules marked “In the demo” can be tried now in the demo workspace with sample data. “In rollout” modules arrive during your setup." />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MODULES.map((m) => (
                <div key={m.title} className="rounded-xl border border-line bg-surface p-5">
                  <div className="flex items-center justify-between gap-2">
                    <m.icon className="size-5 text-accent" aria-hidden />
                    <span className={m.status === "rollout" ? "rounded-md bg-warn-soft px-1.5 py-0.5 text-[11px] font-medium text-warn" : "rounded-md bg-pos-soft px-1.5 py-0.5 text-[11px] font-medium text-pos"}>{m.status === "rollout" ? "In rollout" : "In the demo"}</span>
                  </div>
                  <p className="mt-3 text-[15px] font-semibold">{m.title}</p>
                  <p className="mt-1 text-[13.5px] text-muted">{m.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Automation */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead eyebrow="AUTOMATION" title="Let the routine work run itself" body="Automations are part of the rollout plan and are switched on for your workspace as each one goes live." />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {AUTOMATIONS.map((a) => (
              <div key={a.title} className="flex gap-3.5 rounded-xl border border-line bg-surface p-5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent"><a.icon className="size-4.5" /></span>
                <div><p className="text-[15px] font-semibold">{a.title}</p><p className="mt-1 text-[13.5px] text-muted">{a.body}</p></div>
              </div>
            ))}
          </div>
        </section>

        {/* Listing check */}
        <section className="bg-surface/60 border-y border-line">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <SectionHead id="listing-check" eyebrow="FREE TOOL" title="Check a product listing in ten seconds" body="Paste a title and feature points from Amazon, Flipkart or Myntra. You get a score and the exact fix for each problem — the same check your team gets inside ENTRAIQ." />
            <div className="mt-8"><ListingChecker /></div>
          </div>
        </section>

        {/* Pricing */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead id="pricing" eyebrow="PRICING" title="Pay for the sellers you manage, nothing more" body={`One-time setup of ₹${PRICING.setupFee.toLocaleString("en-IN")}, then ₹${PRICING.platformFee.toLocaleString("en-IN")} a month plus ₹${PRICING.perSeller.toLocaleString("en-IN")} for each active seller. Hosting, backups, security updates and ${PRICING.includedHoursPerMonth} hours of small changes a month are included.`} />
          <div className="mt-8"><FeeCalculator /></div>
        </section>

        {/* Connections */}
        <section className="bg-surface/60 border-y border-line">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <SectionHead eyebrow="CONNECTIONS" title="What's connected today, and what's next" body="We'd rather tell you exactly where each connection stands than promise a button that doesn't work yet." />
            <div className="mt-8 overflow-x-auto rounded-xl border border-line bg-surface">
              <table className="w-full min-w-[560px] text-left text-[13.5px]">
                <thead className="border-b border-line bg-raised text-[12px] text-muted"><tr><th className="px-4 py-2.5 font-medium">Marketplace</th><th className="px-4 py-2.5 font-medium">Live connection</th><th className="px-4 py-2.5 font-medium">Available today</th></tr></thead>
                <tbody className="divide-y divide-line">
                  {CONNECTIONS.map(([m, live, now]) => <tr key={m}><td className="px-4 py-3 font-medium">{m}</td><td className="px-4 py-3 text-muted">{live}</td><td className="px-4 py-3">{now}</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <SectionHead id="faq" eyebrow="FAQ" title="Questions agencies ask us" />
          <div className="mt-6 divide-y divide-line rounded-xl border border-line bg-surface">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group px-5 py-4">
                <summary className="cursor-pointer list-none text-[14.5px] font-medium marker:hidden">{q}<span className="float-right text-muted group-open:rotate-45">+</span></summary>
                <p className="mt-2 text-[14px] text-muted">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Demo request */}
        <section className="border-t border-line bg-surface/60">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionHead id="demo" eyebrow="BOOK A DEMO" title="See ENTRAIQ with your own agency in mind" body="Tell us a little about your agency. We'll walk you through the platform on a call and set up a workspace for your first sellers." />
              <ul className="mt-6 space-y-2 text-[14px] text-muted">
                {["A 30-minute call, online or in person in Tamil Nadu", "A walkthrough using sample data shaped like your sellers", "A written quote based on the sellers you manage"].map((t) => <li key={t} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-pos" />{t}</li>)}
              </ul>
            </div>
            <DemoForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
