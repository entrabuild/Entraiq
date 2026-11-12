import { json, withAccount } from "@/server/live-api";
import { listPosts } from "@/server/meta";

export const dynamic = "force-dynamic";

export async function GET() {
  return withAccount(async (a) => json({ ok: true, posts: await listPosts(a.id) }));
}
