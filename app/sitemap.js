import { cars } from "@/data/cars";
import { publishedPosts } from "@/data/blog";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://used-car-roadz.vercel.app").replace(/\/$/, "");

export default function sitemap() {
  const now = new Date();

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1
    },
    ...cars.map((car) => ({
      url: `${siteUrl}/cars/${car.slug}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9
    })),
    {
      url: `${siteUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8
    },
    ...publishedPosts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
      changeFrequency: "weekly",
      priority: 0.75
    }))
  ];
}
