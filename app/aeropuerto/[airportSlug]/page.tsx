export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* =====================================================
   Metadata — SEO Dominant Version
===================================================== */

export async function generateMetadata(
  { params }: { params: Promise<{ airportSlug: string }> }
): Promise<Metadata> {
  const { airportSlug } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: airport } = await supabase
    .from("airports")
    .select("name, slug")
    .eq("slug", airportSlug)
    .single();

  if (!airport) {
    return {};
  }

  const title = `Parqueaderos en el Aeropuerto ${airport.name}`;

  const description = `Compara parqueaderos cerca del Aeropuerto ${airport.name}. Revisa precios por día, opciones cubiertas y al aire libre, y reserva directamente con el operador.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/aeropuerto/${airport.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/aeropuerto/${airport.slug}`,
    },
  };
}

/* =====================================================
   Page
===================================================== */

export default async function AirportPage({
  params,
}: {
  params: Promise<{ airportSlug: string }>;
}) {
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

  /* -----------------------------
     1️⃣ Fetch airport + city
  ----------------------------- */

  const { data: airport } = await supabase
    .from("airports")
    .select("id, name, slug, code, city:cities(id, name, slug)")
    .eq("slug", airportSlug)
    .single();

  if (!airport) return notFound();

  const city = Array.isArray(airport.city)
  ? airport.city[0]
  : airport.city;

  /* -----------------------------
     2️⃣ Fetch parking offers (include distance)
  ----------------------------- */

  const { data: offers } = await supabase
    .from("parkings")
    .select(
      `id,
       name,
       slug,
       price_per_day,
       currency,
       vehicle,
       is_covered,
       logo_url,
       parking_location_id,
       parking_location:parking_locations(
         slug,
         distance_km
       )`
    )
    .eq("airport_id", airport.id)
    .eq("is_active", true)
    .order("price_per_day");

  const lowestPrice = offers && offers.length > 0
    ? offers[0].price_per_day
    : null;

  const offerCount = offers ? offers.length : 0;

  /* -----------------------------
     3️⃣ Group by parking_location_id
  ----------------------------- */

  const grouped = (offers || []).reduce((acc: any, offer: any) => {
    const key = offer.parking_location_id;

    if (!acc[key]) {
      acc[key] = {
        name: offer.name,
        logo_url: offer.logo_url,
        location_slug: offer.parking_location?.slug,
        distance_km: offer.parking_location?.distance_km,
        offers: [],
      };
    }

    acc[key].offers.push(offer);
    return acc;
  }, {});

  const parkingGroups = Object.values(grouped);

  /* -----------------------------
     4️⃣ Structured Data
  ----------------------------- */

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://comparaparqueaderos.com";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: `${siteUrl}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: city.name,
        item: `${siteUrl}/ciudad/${city.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Aeropuerto ${airport.name}`,
        item: `${siteUrl}/aeropuerto/${airport.slug}`,
      },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: parkingGroups.map((group: any, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      name: group.name,
      url: `${siteUrl}/aeropuerto/${airport.slug}/parqueadero/${group.location_slug}`,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `¿Cuánto cuesta parquear en el Aeropuerto ${airport.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: lowestPrice
            ? `Los precios comienzan desde ${offers?.[0].currency} ${lowestPrice.toLocaleString("es-CO")} por día.`
            : `Los precios varían según el tipo de vehículo y el operador.`,
        },
      },
      {
        "@type": "Question",
        name: `¿Hay parqueaderos cubiertos cerca del Aeropuerto ${airport.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Sí, existen opciones cubiertas y al aire libre con vigilancia y diferentes niveles de servicio.`,
        },
      },
      {
        "@type": "Question",
        name: `¿Se puede reservar directamente con el parqueadero?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Sí, puedes contactar directamente con el operador desde la página de detalle de cada parqueadero.`,
        },
      },
    ],
  };

  return (
    <>
      <Header />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="min-h-screen relative">
        <div className="mx-auto max-w-7xl px-4 lg:px-6 py-6 lg:py-10">

          {/* Breadcrumbs */}
          <nav className="text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:underline">Inicio</Link>
            <span className="mx-1">/</span>
            <Link href={`/ciudad/${city.slug}`} className="hover:underline">
              {city.name}
            </Link>
            <span className="mx-1">/</span>
            <span className="text-gray-800">Aeropuerto {airport.name}</span>
          </nav>

          {/* Hero */}
          <section className="mb-8 max-w-3xl">
            <h1 className="text-2xl font-bold">
              Parqueaderos en el Aeropuerto {airport.name}
            </h1>
            <p className="mt-2 text-gray-600">
              Encuentra {offerCount} opciones de parqueaderos cerca del Aeropuerto {airport.name} en {city.name}. 
              Compara precios por día, opciones cubiertas y al aire libre.
              {lowestPrice && (
                <> Tarifas desde {offers?.[0].currency} {lowestPrice.toLocaleString("es-CO")} por día.</>
              )}
            </p>
          </section>

            {/* SEO Intro Block */}
            <section className="mb-12 max-w-4xl text-gray-700 leading-relaxed space-y-4">
              <p>
                El Aeropuerto {airport.name} es uno de los principales puntos de salida y llegada en {city.name}. 
                Contar con un parqueadero cercano al aeropuerto te permite ahorrar tiempo, evitar contratiempos y 
                viajar con mayor tranquilidad.
              </p>

              <p>
                En esta página puedes comparar parqueaderos oficiales y privados ubicados cerca del Aeropuerto {airport.name}. 
                Mostramos información clara sobre precios por día, tipos de vehículo, opciones cubiertas o al aire libre 
                y la distancia real hasta la terminal.
              </p>

              <p>
                Todas las opciones disponibles te permiten contactar directamente con el operador para confirmar 
                disponibilidad y realizar tu reserva de forma rápida y segura.
              </p>
            </section>

          {/* Cards */}
          <section>
            <h2 className="text-lg font-semibold mb-6">Parqueaderos disponibles</h2>

            {parkingGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {parkingGroups.map((group: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-gray-200 bg-white overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="bg-blue-50 border-b border-blue-100 px-5 py-3 h-[72px] flex items-center justify-center text-center">
                      <div className="font-semibold text-base text-gray-900 line-clamp-2">
                        {group.name}
                      </div>
                    </div>

                    <div className="h-24 w-full px-4 pt-3">
                      <div className="h-full flex items-center justify-center bg-white">
                        {group.logo_url ? (
                          <img
                            src={group.logo_url}
                            alt={`Logo ${group.name}`}
                            className="max-h-14 object-contain"
                          />
                        ) : (
                          <span className="text-sm text-gray-400">LOGO</span>
                        )}
                      </div>
                    </div>

                    {/* Distance */}
                    {group.distance_km && (
                      <div className="px-5 text-sm text-gray-500 text-center mt-1">
                        📍 {Number(group.distance_km).toFixed(1)} km del aeropuerto
                      </div>
                    )}

                    <div className="px-5 py-4 flex flex-col gap-2.5 flex-1 justify-between">
                      <div className="space-y-2">
                        {group.offers.map((offer: any) => (
                          <div
                            key={offer.id}
                            className="flex items-center justify-between text-sm border-b border-gray-100 pb-1.5"
                          >
                            <span className="text-gray-700">
                              {offer.vehicle} | {offer.is_covered ? "Cubierto" : "Aire Libre"}
                            </span>
                            <span className="font-semibold text-green-700">
                              {offer.currency} {offer.price_per_day.toLocaleString("es-CO")}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 flex justify-center">
                        {group.location_slug && (
                          <Link
                            href={`/aeropuerto/${airport.slug}/parqueadero/${group.location_slug}`}
                            className="inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 transition-all duration-200 shadow-sm hover:shadow"
                          >
                            Ver detalles
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No hay parqueaderos disponibles para este aeropuerto.
              </p>
            )}
          </section>

          {/* Why Choose Section */}
          <section className="mt-16 mb-10 max-w-4xl space-y-6">
            <h2 className="text-xl font-semibold">
              ¿Por qué elegir un parqueadero cerca del Aeropuerto {airport.name}?
            </h2>

            <div className="space-y-4 text-gray-700">
              <p>
                Elegir un parqueadero cercano al aeropuerto reduce tiempos de traslado y facilita tu llegada a la terminal. 
                Muchas opciones incluyen servicio de transporte tipo shuttle, vigilancia permanente y control de acceso.
              </p>

              <p>
                Dependiendo de tu presupuesto y preferencias, puedes optar por parqueaderos cubiertos o al aire libre, 
                con diferentes niveles de seguridad y comodidad. Comparar antes de reservar te permite encontrar 
                la mejor relación entre precio y servicio.
              </p>

              <p>
                Si viajas por varios días, dejar tu vehículo en un parqueadero cercano al Aeropuerto {airport.name} 
                puede ser una alternativa más práctica que otras opciones de transporte.
              </p>
            </div>
          </section>

          {/* FAQ Visible Section */}
          <section className="mt-16 mb-12 max-w-4xl space-y-6">
            <h2 className="text-xl font-semibold">Preguntas frecuentes</h2>

            <div>
              <h3 className="font-semibold">¿Cuánto cuesta parquear en el Aeropuerto {airport.name}?</h3>
              <p className="text-gray-600">
                {lowestPrice
                  ? `Las tarifas comienzan desde ${offers?.[0].currency} ${lowestPrice.toLocaleString("es-CO")} por día.`
                  : `Los precios dependen del tipo de vehículo y el operador.`}
              </p>
            </div>

            <div>
              <h3 className="font-semibold">¿Hay parqueaderos cubiertos?</h3>
              <p className="text-gray-600">
                Sí, puedes encontrar opciones cubiertas y al aire libre cerca del aeropuerto.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">¿Se puede reservar directamente?</h3>
              <p className="text-gray-600">
                Puedes contactar directamente con el operador desde su página de detalle.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
