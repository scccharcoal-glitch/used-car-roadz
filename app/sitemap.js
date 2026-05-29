import { cars } from "@/data/cars";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

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
    }))
  ];
}
