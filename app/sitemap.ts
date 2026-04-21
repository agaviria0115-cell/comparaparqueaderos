import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://comparaparqueaderos.com";

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const urls: MetadataRoute.Sitemap = [];

  // Helper to safely push URLs (avoids duplicates)
  const seen = new Set<string>();
  const addUrl = (urlObj: MetadataRoute.Sitemap[number]) => {
    if (!seen.has(urlObj.url)) {
      seen.add(urlObj.url);
      urls.push(urlObj);
    }
  };

  const now = new Date();

  // Home
  addUrl({
    url: `${baseUrl}`,
    changeFrequency: "weekly",
    priority: 1.0,
    lastModified: now,
  });

  // Static pages
  const staticPages = [
    "/como-funciona",
    "/contacto",
    "/privacidad",
    "/terminos",
  ];

  staticPages.forEach((page) => {
    addUrl({
      url: `${baseUrl}${page}`,
      changeFrequency: "monthly",
      priority: 0.5,
      lastModified: now,
    });
  });

  // Cities
  const { data: cities, error: citiesError } = await supabase
    .from("cities")
    .select("slug");

  if (!citiesError && cities) {
    cities.forEach((city) => {
      if (!city.slug) return;

      addUrl({
        url: `${baseUrl}/ciudad/${city.slug}`,
        changeFrequency: "weekly",
        priority: 0.7,
        lastModified: now,
      });
    });
  } else {
    console.error("Sitemap cities error:", citiesError);
  }

  // Airports
  const { data: airports, error: airportsError } = await supabase
    .from("airports")
    .select("slug");

  if (!airportsError && airports) {
    airports.forEach((airport) => {
      if (!airport.slug) return;

      addUrl({
        url: `${baseUrl}/aeropuerto/${airport.slug}`,
        changeFrequency: "weekly",
        priority: 0.9,
        lastModified: now,
      });
    });
  } else {
    console.error("Sitemap airports error:", airportsError);
  }

  // Parking pages
  const { data: parkings, error: parkingsError } = await supabase
    .from("parkings")
    .select("slug, airports ( slug )")
    .eq("is_active", true);

  if (!parkingsError && parkings) {
    parkings.forEach((p) => {
      if (!p.slug || !p.airports) return;

      const airport = Array.isArray(p.airports)
        ? p.airports[0]
        : p.airports;

      if (!airport?.slug) return;

      addUrl({
        url: `${baseUrl}/aeropuerto/${airport.slug}/parqueadero/${p.slug}`,
        changeFrequency: "weekly",
        priority: 0.8,
        lastModified: now,
      });
    });
  } else {
    console.error("Sitemap parkings error:", parkingsError);
  }

  return urls;
}