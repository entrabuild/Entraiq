import "server-only";
import { open, seal } from "./connectors/token-vault";
import { newId, num, sql } from "./db";

/**
 * Meta (Facebook Pages + Instagram) for the live test, through the official Graph API with plain fetch.
 * Tokens are sealed with the AES-256-GCM vault before they touch the database.
 * While the Meta app is in Development mode, only people with a role on the app (admin, developer, tester)
 * can connect — exactly right for Shalini's test, and no app review is needed for that.
 */
const VERSION = process.env.META_GRAPH_VERSION || "v23.0";
const GRAPH = `https://graph.facebook.com/${VERSION}`;
const SCOPES = ["pages_show_list", "pages_read_engagement", "pages_manage_posts", "instagram_basic", "instagram_content_publish", "business_management"];

export const metaConfigured = () => !!process.env.META_APP_ID && !!process.env.META_APP_SECRET && !!process.env.TOKEN_ENCRYPTION_KEY;

export function authUrl(origin: string, state: string): string {
  const p = new URLSearchParams({ client_id: process.env.META_APP_ID!, redirect_uri: `${origin}/api/meta/callback`, state, response_type: "code" });
  // Business-type apps use "Facebook Login for Business" configurations; classic apps use scopes.
  if (process.env.META_CONFIG_ID) p.set("config_id", process.env.META_CONFIG_ID);
  else p.set("scope", SCOPES.join(","));
  return `https://www.facebook.com/${VERSION}/dialog/oauth?${p}`;
}

type GraphError = { error?: { message?: string; error_user_msg?: string } };
async function graph<T>(path: string, init?: RequestInit & { query?: Record<string, string> }): Promise<T> {
  const url = new URL(`${GRAPH}${path}`);
  for (const [k, v] of Object.entries(init?.query ?? {})) url.searchParams.set(k, v);
  const res = await fetch(url, { ...init, cache: "no-store", signal: AbortSignal.timeout(30000) });
  const body = (await res.json().catch(() => ({}))) as T & GraphError;
  if (!res.ok || body.error) throw new Error(body.error?.error_user_msg || body.error?.message || `Meta error ${res.status}`);
  return body;
}

/** OAuth callback: code → user token → long-lived token → Pages (+ their Instagram accounts), saved sealed. */
export async function connect(accountId: string, origin: string, code: string): Promise<{ pages: number; instagram: number }> {
  const app = { client_id: process.env.META_APP_ID!, client_secret: process.env.META_APP_SECRET! };
  const short = await graph<{ access_token: string }>("/oauth/access_token", { query: { ...app, redirect_uri: `${origin}/api/meta/callback`, code } });
  const long = await graph<{ access_token: string }>("/oauth/access_token", { query: { ...app, grant_type: "fb_exchange_token", fb_exchange_token: short.access_token } });
  const pages = await graph<{ data: { id: string; name: string; access_token: string; instagram_business_account?: { id: string; username?: string } }[] }>("/me/accounts", {
    query: { fields: "id,name,access_token,instagram_business_account{id,username}", limit: "50", access_token: long.access_token },
  });
  let ig = 0;
  for (const p of pages.data) {
    await upsertTarget(accountId, "facebook", p.id, p.name, p.access_token, p.id);
    if (p.instagram_business_account) {
      ig++;
      await upsertTarget(accountId, "instagram", p.instagram_business_account.id, p.instagram_business_account.username ? `@${p.instagram_business_account.username}` : `${p.name} (Instagram)`, p.access_token, p.id);
    }
  }
  return { pages: pages.data.length, instagram: ig };
}

async function upsertTarget(accountId: string, kind: "facebook" | "instagram", externalId: string, name: string, pageToken: string, pageId: string) {
  await sql(
    `INSERT INTO live_meta_targets (id, account_id, kind, external_id, name, token, page_id) VALUES ($1,$2,$3,$4,$5,$6,$7)
     ON CONFLICT (account_id, kind, external_id) DO UPDATE SET name = EXCLUDED.name, token = EXCLUDED.token, page_id = EXCLUDED.page_id`,
    [newId(), accountId, kind, externalId, name, seal(pageToken), pageId],
  );
}

export interface Target { id: string; kind: "facebook" | "instagram"; externalId: string; name: string }
export async function listTargets(accountId: string): Promise<Target[]> {
  const rows = await sql(`SELECT id, kind, external_id, name FROM live_meta_targets WHERE account_id = $1 ORDER BY kind, name`, [accountId]);
  return rows.map((r) => ({ id: r.id!, kind: r.kind as Target["kind"], externalId: r.external_id!, name: r.name ?? "" }));
}
export const disconnect = (accountId: string) => sql(`DELETE FROM live_meta_targets WHERE account_id = $1`, [accountId]);

export interface PublishResult { targetId: string; name: string; kind: string; ok: boolean; permalink?: string; error?: string }

/** Publish one stored image to the chosen Pages / Instagram accounts. `publicUrl` must be reachable by Meta. */
export async function publish(accountId: string, mediaId: string, publicUrl: string, caption: string, targetIds: string[]): Promise<PublishResult[]> {
  const media = (await sql(`SELECT mime, data FROM live_media WHERE id = $1 AND account_id = $2`, [mediaId, accountId]))[0];
  if (!media) throw new Error("That image was not found. Upload it again.");
  const out: PublishResult[] = [];
  for (const tid of targetIds) {
    const t = (await sql(`SELECT id, kind, external_id, name, token FROM live_meta_targets WHERE id = $1 AND account_id = $2`, [tid, accountId]))[0];
    if (!t) continue;
    const token = open(t.token!);
    const postId = newId();
    try {
      let externalId: string;
      let permalink: string | undefined;
      if (t.kind === "facebook") {
        // Upload the bytes directly, so Facebook does not need to fetch a public URL.
        const form = new FormData();
        form.set("source", new Blob([new Uint8Array(Buffer.from(media.data!, "base64"))], { type: media.mime! }), "creative.jpg");
        form.set("caption", caption);
        form.set("access_token", token);
        const r = await graph<{ id: string; post_id?: string }>(`/${t.external_id}/photos`, { method: "POST", body: form });
        externalId = r.post_id ?? r.id;
        permalink = (await graph<{ permalink_url?: string }>(`/${externalId}`, { query: { fields: "permalink_url", access_token: token } }).catch(() => ({ permalink_url: undefined }))).permalink_url;
      } else {
        // Instagram fetches the image from our public media URL (JPEG), then publishes the container.
        const c = await graph<{ id: string }>(`/${t.external_id}/media`, { method: "POST", query: { image_url: publicUrl, caption, access_token: token } });
        await waitForContainer(c.id, token);
        const p = await graph<{ id: string }>(`/${t.external_id}/media_publish`, { method: "POST", query: { creation_id: c.id, access_token: token } });
        externalId = p.id;
        permalink = (await graph<{ permalink?: string }>(`/${externalId}`, { query: { fields: "permalink", access_token: token } }).catch(() => ({ permalink: undefined }))).permalink;
      }
      await sql(`INSERT INTO live_posts (id, account_id, media_id, caption, kind, target_id, target_name, external_id, permalink, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'published')`,
        [postId, accountId, mediaId, caption, t.kind, t.id, t.name, externalId, permalink ?? null]);
      out.push({ targetId: t.id!, name: t.name ?? "", kind: t.kind!, ok: true, permalink });
    } catch (e) {
      const error = e instanceof Error ? e.message : "Publishing failed";
      await sql(`INSERT INTO live_posts (id, account_id, media_id, caption, kind, target_id, target_name, status, error) VALUES ($1,$2,$3,$4,$5,$6,$7,'failed',$8)`,
        [postId, accountId, mediaId, caption, t.kind, t.id, t.name, error]);
      out.push({ targetId: t.id!, name: t.name ?? "", kind: t.kind!, ok: false, error });
    }
  }
  return out;
}

async function waitForContainer(id: string, token: string) {
  for (let i = 0; i < 10; i++) {
    const s = await graph<{ status_code?: string }>(`/${id}`, { query: { fields: "status_code", access_token: token } });
    if (!s.status_code || s.status_code === "FINISHED") return;
    if (s.status_code === "ERROR" || s.status_code === "EXPIRED") throw new Error("Instagram could not process the image. Use a JPEG between 320 and 1440 px wide.");
    await new Promise((r) => setTimeout(r, 1500));
  }
}

export interface PostRow { id: string; kind: string; targetName: string; caption: string; status: string; error: string | null; permalink: string | null; likes: number | null; comments: number | null; createdAt: string; mediaId: string | null }

/** Recent posts; refreshes likes/comments for published ones not checked in the last 10 minutes. */
export async function listPosts(accountId: string): Promise<PostRow[]> {
  const rows = await sql(`SELECT p.*, t.token, (p.checked_at IS NULL OR p.checked_at < now() - interval '10 minutes') AS stale FROM live_posts p LEFT JOIN live_meta_targets t ON t.id = p.target_id WHERE p.account_id = $1 ORDER BY p.created_at DESC LIMIT 30`, [accountId]);
  for (const r of rows.slice(0, 10)) {
    if (r.status !== "published" || !r.external_id || !r.token || r.stale !== "t") continue;
    try {
      const token = open(r.token);
      let likes = 0, comments = 0;
      if (r.kind === "instagram") {
        const m = await graph<{ like_count?: number; comments_count?: number }>(`/${r.external_id}`, { query: { fields: "like_count,comments_count", access_token: token } });
        likes = m.like_count ?? 0; comments = m.comments_count ?? 0;
      } else {
        const m = await graph<{ likes?: { summary?: { total_count?: number } }; comments?: { summary?: { total_count?: number } } }>(`/${r.external_id}`, { query: { fields: "likes.summary(true).limit(0),comments.summary(true).limit(0)", access_token: token } });
        likes = m.likes?.summary?.total_count ?? 0; comments = m.comments?.summary?.total_count ?? 0;
      }
      await sql(`UPDATE live_posts SET likes = $2, comments = $3, checked_at = now() WHERE id = $1`, [r.id, likes, comments]);
      r.likes = String(likes); r.comments = String(comments);
    } catch { /* keep the last numbers; Meta may be rate-limiting */ }
  }
  return rows.map((r) => ({
    id: r.id!, kind: r.kind!, targetName: r.target_name ?? "", caption: r.caption ?? "", status: r.status!, error: r.error, permalink: r.permalink,
    likes: r.likes == null ? null : num(r.likes), comments: r.comments == null ? null : num(r.comments), createdAt: r.created_at!, mediaId: r.media_id,
  }));
}
