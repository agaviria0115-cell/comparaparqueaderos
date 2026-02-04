import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Metadata } from "next";

interface AirportPageProps {
  params: Promise<{
    airportSlug: string;
  }>;
}

export async function generateMetadata(
  { params }: { params: Promise<{ airportSlug: string }> }
): Promise<Metadata> {
  const { airportSlug } = await params;

  return {
    title: `Parqueaderos en el aeropuerto ${airportSlug} | Comparaparqueaderos`,
    description: `Compara parqueaderos cerca del aeropuerto ${airportSlug}. Precios, servicios y contacto directo.`,
    alternates: {
      canonical: `/aeropuerto/${airportSlug}`,
    },
  };
}

export default async function AirportPage({ params }: AirportPageProps) {
  const { airportSlug } = await params;
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

  // 1️⃣ Fetch airport by slug
  const { data: airport, error: airportError } = await supabase
    .from("airports")
    .select("id, name, slug")
    .eq("slug", airportSlug)
    .single();

  if (airportError || !airport) {
    notFound();
  }

  // 2️⃣ Fetch active parkings for this airport
  const { data: parkings } = await supabase
    .from("parkings")
    .select("id, name, slug, price_per_day, currency")
    .eq("airport_id", airport.id)
    .eq("is_active", true)
    .order("price_per_day");

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
                "name": airport.name,
                "item": `https://comparaparqueaderos.com/aeropuerto/${airport.slug}`
              }
            ]
          }),
        }}
      />

      <h1>Parqueaderos en {airport.name}</h1>

      {parkings && parkings.length > 0 ? (
        <ul>
          {parkings.map((parking) => (
            <li key={parking.id}>
              <div>
                <h3>{parking.name}</h3>

                <p>
                  {parking.currency} {parking.price_per_day}
                </p>

                <Link
                  href={`/aeropuerto/${airport.slug}/parqueadero/${parking.slug}`}
                >
                  Ver detalles
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay parqueaderos disponibles para este aeropuerto.</p>
      )}
    </main>
  );
}