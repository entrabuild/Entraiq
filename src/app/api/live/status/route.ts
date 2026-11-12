import { json } from "@/server/live-api";

export const dynamic = "force-dynamic";

/** Which live services are configured — names only, never the values. */
export function GET() {
  const set = (k: string) => !!process.env[k];
  return json({
    ok: true,
    database: set("DATABASE_URL"),
    email: set("RESEND_API_KEY") && set("MAIL_FROM"),
    alertEmail: set("ALERT_EMAIL"),
    sessionSecret: set("SESSION_SECRET"),
    vault: set("TOKEN_ENCRYPTION_KEY"),
    meta: set("META_APP_ID") && set("META_APP_SECRET"),
    allowList: set("LIVE_ALLOWED_EMAILS"),
  });
}
