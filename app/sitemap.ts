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

  // Home
  urls.push({
    url: `${baseUrl}`,
    changeFrequency: "weekly",
    priority: 1.0,
    lastModified: new Date(),
  });

  // Static pages
  const staticPages = [
    "/como-funciona",
    "/contacto",
    "/privacidad",
    "/terminos",
  ];

  staticPages.forEach((page) => {
    urls.push({
      url: `${baseUrl}${page}`,
      changeFrequency: "monthly",
      priority: 0.5,
      lastModified: new Date(),
    });
  });

  // Cities
  const { data: cities } = await supabase.from("cities").select("slug");

  cities?.forEach((city) => {
    urls.push({
      url: `${baseUrl}/ciudad/${city.slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
      lastModified: new Date(),
    });
  });

  // Airports
  const { data: airports } = await supabase.from("airports").select("slug");

  airports?.forEach((airport) => {
    urls.push({
      url: `${baseUrl}/aeropuerto/${airport.slug}`,
      changeFrequency: "weekly",
      priority: 0.9,
      lastModified: new Date(),
    });
  });

  // Parking pages
  const { data: parkings } = await supabase
    .from("parkings")
    .select("slug, airports ( slug )")
    .eq("is_active", true);

  parkings?.forEach((p) => {
    const airport = p.airports?.[0];
    if (!airport?.slug) return;

    urls.push({
      url: `${baseUrl}/aeropuerto/${airport.slug}/parqueadero/${p.slug}`,
      priority: 0.8,
      lastModified: new Date(),
    });
  });

  return urls;
}