import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const EDITOR_ROLES = ["super_admin", "admin", "manager"];
const APPROVER_ROLES = ["super_admin", "admin"];
const STATUSES = ["draft", "review", "scheduled", "published", "archived"];
const BULK_OPS = ["publish", "draft", "archive", "delete"];

const EDITABLE_FIELDS = [
  "slug", "title", "category", "categories", "excerpt", "content",
  "coverImage", "coverImageAlt", "author", "authorRole", "authorBio",
  "lastReviewedDate", "publishDate", "scheduledDate", "scheduledTimezone",
  "metaTitle", "metaDescription", "focusKeyword", "secondaryKeywords",
  "canonicalUrl", "ogTitle", "ogDescription", "ogImage", "noindex", "tags",
  "status", "previousSlugs", "aiAssisted", "aiApproved",
];

function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function pickEditable(data) {
  const out = {};
  for (const key of EDITABLE_FIELDS) {
    if (data[key] !== undefined) out[key] = data[key];
  }
  return out;
}

function todayInIst() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

async function resolveEditor(base44, user) {
  const rows = await base44.asServiceRole.entities.SiteUser.filter({ email: user.email });
  const record = Array.isArray(rows) ? rows[0] : null;
  if (!record || record.active === false) return null;
  if (!EDITOR_ROLES.includes(record.role)) return null;
  return record;
}

async function uniqueSlug(sr, desired, id) {
  const base = slugify(desired) || "untitled";
  let candidate = base;
  for (let n = 2; n < 60; n += 1) {
    const found = await sr.entities.BlogPost.filter({ slug: candidate });
    const clash = found.find((r) => r.id !== id);
    if (!clash) return candidate;
    candidate = `${base}-${n}`;
  }
  return `${base}-${Date.now()}`;
}

async function savePost(base44, user, role, payload) {
  const sr = base44.asServiceRole;
  const data = pickEditable(payload.data || {});
  const id = payload.id || null;
  const now = new Date().toISOString();

  if (!data.title || !String(data.title).trim()) {
    return { error: "A post title is required", status: 400 };
  }

  const existing = id
    ? await sr.entities.BlogPost.get(id).catch((e) => (e.status === 404 ? null : Promise.reject(e)))
    : null;
  if (id && !existing) return { error: "Post not found", status: 404 };

  const status = STATUSES.includes(data.status) ? data.status : (existing?.status || "draft");
  data.status = status;
  data.slug = await uniqueSlug(sr, data.slug || data.title, id);

  if (status === "scheduled") {
    if (!data.scheduledDate || isNaN(new Date(data.scheduledDate).getTime())) {
      return { error: "A valid schedule date and time is required", status: 400 };
    }
  }
  data.scheduledTimezone = "Asia/Kolkata";

  const aiAssisted = data.aiAssisted !== undefined ? !!data.aiAssisted : !!existing?.aiAssisted;
  const aiApproved = data.aiApproved !== undefined ? !!data.aiApproved : !!existing?.aiApproved;
  data.aiAssisted = aiAssisted;

  const goingLive = status === "published" || status === "scheduled";
  if (aiAssisted && !aiApproved && goingLive) {
    if (!APPROVER_ROLES.includes(role)) {
      return { error: "AI-assisted content must be approved by an administrator before it can be published", status: 403 };
    }
    data.aiApproved = true;
    data.aiApprovedBy = user.email;
    data.aiApprovedAt = now;
  } else {
    data.aiApproved = aiApproved;
  }

  if (status === "published") {
    data.publishedAt = existing?.publishedAt || now;
    data.publishDate = data.publishDate || existing?.publishDate || todayInIst();
  } else if (existing?.publishedAt) {
    data.publishedAt = existing.publishedAt;
    data.publishDate = data.publishDate || existing.publishDate;
  }

  let saved;
  if (id) {
    saved = await sr.entities.BlogPost.update(id, data);
    const oldSlug = existing?.slug;
    if (oldSlug && oldSlug !== data.slug && existing?.status === "published") {
      const redirects = await sr.entities.BlogRedirect.filter({ fromSlug: oldSlug });
      const existingRedirect = redirects.find((r) => r.postId === id);
      const redirectPayload = { fromSlug: oldSlug, toSlug: data.slug, postId: id, postTitle: data.title, statusCode: 301 };
      if (existingRedirect) await sr.entities.BlogRedirect.update(existingRedirect.id, redirectPayload);
      else await sr.entities.BlogRedirect.create(redirectPayload);
    }
  } else {
    saved = await sr.entities.BlogPost.create(data);
  }

  return { post: saved };
}

async function bulkUpdate(base44, role, payload) {
  const sr = base44.asServiceRole;
  const ids = Array.isArray(payload.ids) ? payload.ids.filter(Boolean) : [];
  const operation = payload.operation;
  if (!ids.length) return { error: "No posts selected", status: 400 };
  if (!BULK_OPS.includes(operation)) return { error: "Unknown bulk operation", status: 400 };

  if (operation === "delete") {
    await sr.entities.BlogPost.deleteMany({ id: { $in: ids } });
    return { affected: ids.length, operation };
  }

  const records = await sr.entities.BlogPost.filter({ id: { $in: ids } });
  if (operation === "publish" && !APPROVER_ROLES.includes(role)) {
    const unapproved = records.find((r) => r.aiAssisted && !r.aiApproved);
    if (unapproved) {
      return { error: "AI-assisted content must be approved by an administrator before it can be published", status: 403 };
    }
  }

  const now = new Date().toISOString();
  const updates = records.map((r) => {
    const next = { id: r.id, status: operation === "draft" ? "draft" : operation === "archive" ? "archived" : "published" };
    if (next.status === "published") {
      next.publishedAt = r.publishedAt || now;
      next.publishDate = r.publishDate || todayInIst();
    }
    return next;
  });

  if (updates.length) await sr.entities.BlogPost.bulkUpdate(updates);
  return { affected: updates.length, operation };
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const siteUser = await resolveEditor(base44, user);
    if (!siteUser) return Response.json({ error: "Forbidden" }, { status: 403 });

    const payload = await req.json().catch(() => ({}));
    const action = payload.action;

    let result;
    if (action === "save") result = await savePost(base44, user, siteUser.role, payload);
    else if (action === "bulk") result = await bulkUpdate(base44, siteUser.role, payload);
    else if (action === "checkSlug") {
      const slug = slugify(payload.slug);
      const found = await base44.asServiceRole.entities.BlogPost.filter({ slug });
      const clash = found.find((r) => r.id !== payload.id);
      result = { slug, available: !clash };
    } else return Response.json({ error: "Unknown action" }, { status: 400 });

    if (result?.error) return Response.json({ error: result.error }, { status: result.status || 400 });
    return Response.json({ ...result, role: siteUser.role });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}