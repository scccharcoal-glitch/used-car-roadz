const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://used-car-roadz.vercel.app").replace(/\/$/, "");

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"]
    },
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
