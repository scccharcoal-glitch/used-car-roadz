import { slugifyCar } from "@/lib/car-utils";

export function linesToKeywords(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizePost(input) {
  const title = String(input.title || "บทความใหม่").trim();
  const slug = slugifyCar(input.slug || title);

  return {
    slug,
    title,
    excerpt: String(input.excerpt || "").trim(),
    coverImage: String(input.coverImage || "").trim(),
    publishedAt: String(input.publishedAt || new Date().toISOString().slice(0, 10)).trim(),
    status: input.status === "draft" ? "draft" : "published",
    keywords: linesToKeywords(input.keywords),
    content: String(input.content || "").trim()
  };
}

export function getPostSummary(post) {
  if (post.excerpt) return post.excerpt;
  return post.content.replace(/[#*![\]()]/g, "").split("\n").find(Boolean)?.slice(0, 160) || "";
}
