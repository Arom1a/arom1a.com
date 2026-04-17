import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const siteUrl = "https://arom1a.com";

export const GET: APIRoute = async () => {
  // Get all blog entries
  const blogEntries = await getCollection("blog");

  // Static pages
  const staticPages: { url: string; priority: number; changefreq: string; lastmod?: string }[] = [
    { url: "/", priority: 1.0, changefreq: "weekly" },
    { url: "/blog/", priority: 0.9, changefreq: "weekly" },
    { url: "/friends/", priority: 0.6, changefreq: "monthly" },
    { url: "/photos/", priority: 0.6, changefreq: "monthly" },
    { url: "/covers/", priority: 0.6, changefreq: "monthly" },
    { url: "/bookmarks/", priority: 0.6, changefreq: "monthly" },
  ];

  // Blog post pages
  const blogPages = blogEntries.map((entry) => ({
    url: `/blog/${entry.slug}/`,
    priority: 0.8,
    changefreq: "monthly",
    lastmod: entry.data.upDate.toISOString().split("T")[0],
  }));

  const allPages = [...staticPages, ...blogPages];

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map((page) => {
    const fullUrl = `${siteUrl}${page.url}`;
    const lastmod = page.lastmod ? `\n    <lastmod>${page.lastmod}</lastmod>` : "";
    return `  <url>
    <loc>${fullUrl}</loc>${lastmod}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
