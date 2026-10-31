import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

function istDate(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  const get = (t) => parts.find((p) => p.type === t)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });

    const sr = base44.asServiceRole;
    const now = new Date();
    const scheduled = await sr.entities.BlogPost.filter({ status: "scheduled" });
    const due = scheduled.filter((p) => p.scheduledDate && new Date(p.scheduledDate).getTime() <= now.getTime());

    if (due.length === 0) return Response.json({ published: 0 });

    await sr.entities.BlogPost.bulkUpdate(
      due.map((p) => ({
        id: p.id,
        status: "published",
        publishedAt: p.publishedAt || now.toISOString(),
        publishDate: p.publishDate || istDate(now),
      }))
    );

    return Response.json({ published: due.length, ids: due.map((p) => p.id) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}