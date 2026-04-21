import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/", // Allow full site crawling
        disallow: [
          "/results",   // Prevent indexing of search results
          "/api",       // Block API routes
          "/actions",   // Block server actions
        ],
      },
    ],
    sitemap: "https://comparaparqueaderos.com/sitemap.xml",
  };
}