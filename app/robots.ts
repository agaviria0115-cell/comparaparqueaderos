import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/ciudad/",
          "/aeropuerto/",
        ],
        disallow: [
          "/results",
          "/api",
        ],
      },
    ],
    sitemap: "https://comparaparqueaderos.com/sitemap.xml",
  };
}