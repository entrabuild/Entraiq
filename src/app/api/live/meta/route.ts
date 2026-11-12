import { json, withAccount } from "@/server/live-api";
import { disconnect, listTargets, metaConfigured } from "@/server/meta";

export const dynamic = "force-dynamic";

export async function GET() {
  return withAccount(async (a) => json({ ok: true, configured: metaConfigured(), targets: await listTargets(a.id) }));
}
export async function DELETE() {
  return withAccount(async (a) => { await disconnect(a.id); return json({ ok: true }); });
}
