import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const EDITOR_ROLES = ["super_admin", "admin", "manager"];
const MAX_CONTENT = 6000;

async function resolveEditor(base44, user) {
  const rows = await base44.asServiceRole.entities.SiteUser.filter({ email: user.email });
  const record = Array.isArray(rows) ? rows[0] : null;
  if (!record || record.active === false) return null;
  if (!EDITOR_ROLES.includes(record.role)) return null;
  return record;
}

function trimContent(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, MAX_CONTENT);
}

const BRAND = "Look A Like Solutions, a performance marketing agency in Bengaluru, India. Voice: practical, data-backed, outcome-driven, no hype.";

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const siteUser = await resolveEditor(base44, user);
    if (!siteUser) return Response.json({ error: "Forbidden" }, { status: 403 });

    const payload = await req.json().catch(() => ({}));
    const action = payload.action;
    const title = String(payload.title || "").slice(0, 200);
    const content = trimContent(payload.content);
    const keyword = String(payload.keyword || "").slice(0, 120);

    if (action === "image") {
      const prompt = String(payload.prompt || "").trim();
      if (!prompt) return Response.json({ error: "An image prompt is required" }, { status: 400 });
      const res = await base44.integrations.Core.GenerateImage({
        prompt: `${prompt}. Editorial illustration for a marketing agency blog, clean modern style, soft light background, no text in the image.`,
      });
      return Response.json({ imageUrl: res.url });
    }

    if (action === "internalLinks") {
      const sr = base44.asServiceRole;
      const [posts, services, caseStudies, insights] = await Promise.all([
        sr.entities.BlogPost.filter({ status: "published" }),
        sr.entities.Service.list(),
        sr.entities.CaseStudy.list(),
        sr.entities.Insight.filter({ status: "published" }),
      ]);
      const catalogue = [
        ...posts.filter((p) => p.slug).slice(0, 25).map((p) => ({ type: "blog", title: p.title, url: `/blog/${p.slug}` })),
        ...services.filter((s) => s.slug).slice(0, 20).map((s) => ({ type: "service", title: s.title, url: `/services/${s.slug}` })),
        ...caseStudies.filter((c) => c.slug).slice(0, 15).map((c) => ({ type: "case study", title: c.clientName, url: `/case-studies/${c.slug}` })),
        ...insights.filter((i) => i.slug).slice(0, 15).map((i) => ({ type: "insight", title: i.title, url: `/insights/${i.slug}` })),
      ];

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an SEO editor for ${BRAND}\n\nArticle title: "${title}"\nArticle summary: ${content.slice(0, 2500)}\n\nPick 4 to 6 of the site pages below that this article should link to internally. Only use pages from this list, in order of relevance. For each, give a natural anchor phrase (3-7 words) that fits the article and a one-sentence reason.\n\nPages:\n${catalogue.map((c) => `- [${c.type}] ${c.title} -> ${c.url}`).join("\n")}`,
        response_json_schema: {
          type: "object",
          properties: {
            links: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  label: { type: "string" },
                  url: { type: "string" },
                  anchor: { type: "string" },
                  reason: { type: "string" },
                },
              },
            },
          },
        },
      });
      return Response.json({ result });
    }

    const prompts = {
      topics: {
        prompt: `You are a content strategist for ${BRAND}\n\nSuggest 6 blog topics for the focus area "${keyword || title || "digital marketing"}". Each topic must be specific, searchable, and useful to an Indian business audience. Return a short rationale for each.`,
        schema: {
          type: "object",
          properties: {
            topics: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  angle: { type: "string" },
                  keyword: { type: "string" },
                },
              },
            },
          },
        },
      },
      outline: {
        prompt: `You are a senior content editor for ${BRAND}\n\nCreate a detailed article outline for the title "${title}". Use 6 to 9 sections with H2/H3 structure and 2 to 3 bullet points per section. Also suggest a working meta description (max 155 characters).`,
        schema: {
          type: "object",
          properties: {
            outline: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  heading: { type: "string" },
                  level: { type: "string" },
                  points: { type: "array", items: { type: "string" } },
                },
              },
            },
            metaDescription: { type: "string" },
          },
        },
      },
      draft: {
        prompt: `You are a senior content writer for ${BRAND}\n\nWrite a complete blog article titled "${title}"${keyword ? ` targeting the keyword "${keyword}"` : ""}. Structure: a direct intro, 4 to 6 H2 sections with H3 subheads where useful, lists where they help, and a practical closing. Use clean semantic HTML (h2, h3, p, ul, ol, li, strong, a). Do not include an h1. Do not invent client names, statistics, or claims we cannot verify; write guidance instead. Also return a 2-sentence excerpt, an SEO title (max 60 characters), and a meta description (max 155 characters).\n\n${content ? `Use this outline as the structure:\n${content}` : ""}`,
        schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            excerpt: { type: "string" },
            content: { type: "string" },
            metaTitle: { type: "string" },
            metaDescription: { type: "string" },
          },
        },
      },
      readability: {
        prompt: `You are a copy editor for ${BRAND}\n\nRewrite the article below for clarity and readability: shorter sentences, active voice, scannable subheads, and no jargon. Keep all facts, links, and the HTML structure intact. Return the improved HTML only.\n\nArticle:\n${content}`,
        schema: {
          type: "object",
          properties: { content: { type: "string" } },
        },
      },
      seo: {
        prompt: `You are an SEO specialist for ${BRAND}\n\nArticle title: "${title}"\nArticle:\n${content}\n\nReturn an SEO title (max 60 characters), a meta description (max 155 characters), one focus keyword, and 4 to 6 secondary keywords. Keep the keyword intent commercial or informational, never spammy.`,
        schema: {
          type: "object",
          properties: {
            metaTitle: { type: "string" },
            metaDescription: { type: "string" },
            focusKeyword: { type: "string" },
            secondaryKeywords: { type: "array", items: { type: "string" } },
          },
        },
      },
      faqs: {
        prompt: `You are an SEO editor for ${BRAND}\n\nBased on the article "${title}", write 4 frequently asked questions with concise answers (2 to 3 sentences each). They should match real search intent and be eligible for FAQ structured data.\n\nArticle:\n${content}`,
        schema: {
          type: "object",
          properties: {
            faqs: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  answer: { type: "string" },
                },
              },
            },
          },
        },
      },
      altText: {
        prompt: `You are an accessibility editor for ${BRAND}\n\nWrite concise, descriptive alt text (max 125 characters) for the featured image of an article titled "${title}". Describe what the image likely shows without keyword stuffing. Also give a short image generation prompt for a fitting hero image.`,
        schema: {
          type: "object",
          properties: {
            alt: { type: "string" },
            imagePrompt: { type: "string" },
          },
        },
      },
    };

    const config = prompts[action];
    if (!config) return Response.json({ error: "Unknown action" }, { status: 400 });
    if ((action === "draft" || action === "readability") && !title && !content) {
      return Response.json({ error: "Add a title or some content first" }, { status: 400 });
    }

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: config.prompt,
      response_json_schema: config.schema,
    });

    return Response.json({ result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}