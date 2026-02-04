import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const urls: MetadataRoute.Sitemap = [];

  // Cities
  const { data: cities } = await supabase
    .from("cities")
    .select("slug");

  cities?.forEach((city) => {
    urls.push({
      url: `https://comparaparqueaderos.com/ciudad/${city.slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  });

  // Airports
  const { data: airports } = await supabase
    .from("airports")
    .select("slug");

  airports?.forEach((airport) => {
    urls.push({
      url: `https://comparaparqueaderos.com/aeropuerto/${airport.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  // Parkings
  const { data: parkings } = await supabase
    .from("parkings")
    .select("slug, airports ( slug )")
    .eq("is_active", true);

  parkings?.forEach((p) => {
    if (!p.airports?.slug) return;

    urls.push({
      url: `https://comparaparqueaderos.com/aeropuerto/${p.airports.slug}/parqueadero/${p.slug}`,
      changeFrequency: "weekly",
      priority: 0.9,
    });
  });

  return urls;
}