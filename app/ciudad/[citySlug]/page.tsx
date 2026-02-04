import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Metadata } from "next";

interface CityPageProps {
  params: Promise<{
    citySlug: string;
  }>;
}

export async function generateMetadata(
  { params }: { params: Promise<{ citySlug: string }> }
): Promise<Metadata> {
  const { citySlug } = await params;

  return {
    title: `Parqueaderos en ${citySlug} | Comparaparqueaderos`,
    description: `Compara parqueaderos cerca de los aeropuertos en ${citySlug}. Precios, servicios y contacto directo.`,
    alternates: {
      canonical: `/ciudad/${citySlug}`,
    },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  // ✅ Await params (critical for your Next.js version)
  const { citySlug } = await params;

  // ✅ Await cookies()
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // 1️⃣ Fetch city by slug
  const { data: city, error: cityError } = await supabase
    .from("cities")
    .select("id, name, slug")
    .eq("slug", citySlug)
    .single();

  if (cityError || !city) {
    notFound();
  }

  // 2️⃣ Fetch airports for this city
  const { data: airports } = await supabase
    .from("airports")
    .select("id, name, slug")
    .eq("city_id", city.id)
    .order("name");

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": "https://comparaparqueaderos.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": city.name,
                "item": `https://comparaparqueaderos.com/ciudad/${city.slug}`
              }
            ]
          }),
        }}
      />

      <h1>Parqueaderos en {city.name}</h1>

      {airports && airports.length > 0 ? (
        <ul>
          {airports.map((airport) => (
            <li key={airport.id}>
              <Link href={`/aeropuerto/${airport.slug}`}>
                {airport.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay aeropuertos disponibles para esta ciudad.</p>
      )}
    </main>
  );
}