"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Mail, MessageCircle, Send } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button, Field, Input, Select, Textarea } from "@/components/ui";
import { BRAND_DEFAULTS } from "@/config/brand";
import { demoRequestSchema, MARKETPLACES, SELLER_BANDS, type DemoRequest } from "@/lib/site/leads";
import { contactLinks, submitLead } from "./submit-lead";

type FormIn = z.input<typeof demoRequestSchema>;

const ALERT_TEXT = {
  sent: "Our team has been alerted and will reply within one working day.",
  pending_configuration: `Your enquiry is recorded. Instant team alerts are not switched on for this site yet, so please also send it to us using a button below.`,
  failed: "Your enquiry is recorded, but the team alert did not go through. Please also send it to us using a button below.",
} as const;

export function DemoForm() {
  const [done, setDone] = React.useState<{ reference: string; alert: keyof typeof ALERT_TEXT; lead: DemoRequest } | null>(null);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormIn, unknown, DemoRequest>({
    resolver: zodResolver(demoRequestSchema),
    defaultValues: { kind: "demo", name: "", agency: "", email: "", phone: "", city: "", sellers: undefined, marketplaces: [], message: "", website: "" },
  });

  const onSubmit = async (v: DemoRequest) => {
    setServerError(null);
    const res = await submitLead(v);
    if (!res.ok || !res.reference) {
      if (res.fields) for (const [k, m] of Object.entries(res.fields)) setError(k as keyof FormIn, { message: m });
      setServerError(res.error ?? "Something went wrong. Please try again.");
      return;
    }
    setDone({ reference: res.reference, alert: res.alert ?? "pending_configuration", lead: v });
  };

  if (done) {
    const links = contactLinks(done.lead, done.reference);
    return (
      <div className="rounded-xl border border-line bg-surface p-6" role="status">
        <CheckCircle2 className="size-7 text-pos" aria-hidden />
        <h3 className="mt-3 text-[18px] font-semibold">Thanks, {done.lead.name.split(" ")[0]}. Your reference is {done.reference}.</h3>
        <p className="mt-2 text-[14px] text-muted">{ALERT_TEXT[done.alert]}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {links.whatsapp && <a href={links.whatsapp} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-md bg-accent px-3 text-[13px] font-medium text-accent-ink"><MessageCircle className="size-4" />Send on WhatsApp</a>}
          <a href={links.email} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line bg-surface px-3 text-[13px] font-medium hover:bg-raised"><Mail className="size-4" />Email it to {BRAND_DEFAULTS.contactEmail}</a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      <input type="hidden" {...register("kind")} />
      <div className="absolute -left-[9999px]" aria-hidden><label>Website<input tabIndex={-1} autoComplete="off" {...register("website")} /></label></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" error={errors.name?.message}><Input autoComplete="name" {...register("name")} /></Field>
        <Field label="Agency or company" error={errors.agency?.message}><Input autoComplete="organization" {...register("agency")} /></Field>
        <Field label="Work email" error={errors.email?.message}><Input type="email" autoComplete="email" {...register("email")} /></Field>
        <Field label="Phone (WhatsApp preferred)" error={errors.phone?.message}><Input type="tel" autoComplete="tel" placeholder="+91" {...register("phone")} /></Field>
        <Field label="City" error={errors.city?.message}><Input autoComplete="address-level2" {...register("city")} /></Field>
        <Field label="Sellers you manage" error={errors.sellers?.message}>
          <Select defaultValue="" {...register("sellers")}>
            <option value="" disabled>Choose</option>
            {SELLER_BANDS.map((b) => <option key={b} value={b}>{b}</option>)}
          </Select>
        </Field>
      </div>
      <fieldset className="mt-4">
        <legend className="mb-1.5 text-[12px] font-medium text-muted">Marketplaces you work on</legend>
        <div className="flex flex-wrap gap-2">
          {MARKETPLACES.map((m) => (
            <label key={m} className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-line px-3 py-1.5 text-[13px] has-[:checked]:border-accent has-[:checked]:bg-accent-soft">
              <input type="checkbox" value={m} className="accent-[var(--accent)]" {...register("marketplaces")} />{m}
            </label>
          ))}
        </div>
        {errors.marketplaces && <p className="mt-1 text-[12px] text-neg">{errors.marketplaces.message}</p>}
      </fieldset>
      <Field label="What would you like to see? (optional)" className="mt-4" error={errors.message?.message}><Textarea rows={3} {...register("message")} /></Field>
      <label className="mt-4 flex items-start gap-2 text-[13px] text-muted">
        <input type="checkbox" className="mt-0.5 accent-[var(--accent)]" {...register("consent")} />
        <span>I agree that {BRAND_DEFAULTS.company} may contact me about ENTRAIQ by email, phone or WhatsApp.</span>
      </label>
      {errors.consent && <p className="mt-1 text-[12px] text-neg">{errors.consent.message}</p>}
      {serverError && <p className="mt-3 rounded-md bg-neg-soft px-3 py-2 text-[13px] text-neg" role="alert">{serverError}</p>}
      <Button type="submit" variant="primary" className="mt-5 h-10 w-full sm:w-auto" disabled={isSubmitting}><Send />{isSubmitting ? "Sending…" : "Request a demo"}</Button>
    </form>
  );
}
