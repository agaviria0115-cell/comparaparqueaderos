import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Metadata } from "next";

interface ParkingPageProps {
  params: Promise<{
    airportSlug: string;
    parkingSlug: string;
  }>;
}

export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{ airportSlug: string; parkingSlug: string }>;
  }
): Promise<Metadata> {
  const { airportSlug, parkingSlug } = await params;

  return {
    title: `Parqueadero ${parkingSlug} – Aeropuerto ${airportSlug} | Comparaparqueaderos`,
    description: `Información, precios y servicios del parqueadero ${parkingSlug} cerca del aeropuerto ${airportSlug}.`,
    alternates: {
      canonical: `/aeropuerto/${airportSlug}/parqueadero/${parkingSlug}`,
    },
  };
}

export default async function ParkingPage({ params }: ParkingPageProps) {
  const { airportSlug, parkingSlug } = await params;
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

  // 1️⃣ Fetch airport (context + validation)
  const { data: airport } = await supabase
    .from("airports")
    .select("id, name, slug")
    .eq("slug", airportSlug)
    .single();

  if (!airport) {
    notFound();
  }

  // 2️⃣ Fetch parking by slug AND airport (important!)
  const { data: parking } = await supabase
    .from("parkings")
    .select(
      `
      id,
      name,
      slug,
      price_per_day,
      currency,
      is_covered,
      has_shuttle,
      vehicle,
      distance_km
    `
    )
    .eq("slug", parkingSlug)
    .eq("airport_id", airport.id)
    .single();

  if (!parking) {
    notFound();
  }

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
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": parking.name,
                "item": `https://comparaparqueaderos.com/aeropuerto/${airport.slug}/parqueadero/${parking.slug}`
              }
            ]
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": parking.name,
            "description": `Parqueadero cerca del aeropuerto ${airport.name}`,
            "category": "ParkingService",
            "offers": {
              "@type": "Offer",
              "priceCurrency": parking.currency || "COP",
              "price": parking.price_per_day,
              "availability": "https://schema.org/InStock",
              "url": `https://comparaparqueaderos.com/aeropuerto/${airport.slug}/parqueadero/${parking.slug}`
            }
          }),
        }}
      />

      <h1>{parking.name}</h1>

      <p>
        Aeropuerto: <strong>{airport.name}</strong>
      </p>

      <ul>
        <li>Precio por día: {parking.currency} {parking.price_per_day}</li>
        <li>{parking.is_covered ? "Cubierto" : "Aire libre"}</li>
        <li>{parking.has_shuttle ? "Con shuttle" : "Sin shuttle"}</li>
        <li>Vehículo: {parking.vehicle}</li>
        <li>Distancia: {parking.distance_km} km</li>
      </ul>
    </main>
  );
}