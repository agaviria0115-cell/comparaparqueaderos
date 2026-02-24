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
   Metadata — SEO Enhanced
===================================================== */

export async function generateMetadata(
  { params }: { params: Promise<{ citySlug: string }> }
): Promise<Metadata> {
  const { citySlug } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: city } = await supabase
    .from("cities")
    .select("name, slug")
    .eq("slug", citySlug)
    .single();

  if (!city) {
    return {};
  }

  const title = `Parqueaderos en ${city.name}`;

  const description = `Encuentra parqueaderos cerca de los aeropuertos en ${city.name}. Compara precios por día, opciones cubiertas y al aire libre, y contacta directamente con cada operador.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/ciudad/${city.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/ciudad/${city.slug}`,
    },
  };
}

/* =====================================================
   Page
===================================================== */

export default async function CityPage({
  params,
}: {
  params: Promise<{ citySlug: string }>;
}) {
  const { citySlug } = await params;
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

  const { data: city } = await supabase
    .from("cities")
    .select("id, name, slug")
    .eq("slug", citySlug)
    .single();

  if (!city) return notFound();

  const { data: airports } = await supabase
    .from("airports")
    .select("id, name, slug, code")
    .eq("city_id", city.id)
    .order("name");

  const airportCount = airports ? airports.length : 0;

  /* -----------------------------
     Structured Data
  ----------------------------- */

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

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
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: (airports || []).map((airport: any, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `Aeropuerto ${airport.name}`,
      url: `${siteUrl}/aeropuerto/${airport.slug}`,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `¿Dónde parquear cerca del aeropuerto en ${city.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `En ${city.name} puedes encontrar múltiples opciones de parqueaderos cerca de los aeropuertos. Compara precios, ubicación y servicios antes de elegir.`,
        },
      },
      {
        "@type": "Question",
        name: `¿Hay parqueaderos cubiertos en ${city.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Sí, dependiendo del aeropuerto puedes encontrar parqueaderos cubiertos y al aire libre con diferentes niveles de servicio.`,
        },
      },
      {
        "@type": "Question",
        name: `¿Cómo comparar precios de parqueaderos en ${city.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Selecciona el aeropuerto correspondiente en ${city.name} y revisa las opciones disponibles con precios actualizados por día.`,
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
            <span className="text-gray-800">{city.name}</span>
          </nav>

          {/* Hero */}
          <section className="mb-8 max-w-3xl">
            <h1 className="text-3xl font-bold">
              Parqueaderos en {city.name} cerca del aeropuerto
            </h1>
            <p className="mt-2 text-gray-600">
              Encuentra aeropuertos en {city.name} con opciones de parqueaderos cercanos. 
              Compara precios por día, opciones cubiertas y al aire libre, y contacta directamente con el operador.
            </p>
          </section>

          {/* SEO Intro Block */}
          <section className="mb-12 max-w-4xl text-gray-700 leading-relaxed space-y-4">
            <p>
              {city.name} es una ciudad con alta actividad aérea, por lo que encontrar 
              un parqueadero cercano al aeropuerto puede marcar la diferencia en tu experiencia de viaje. 
              Comparar opciones te permite ahorrar tiempo, dinero y evitar contratiempos el día de tu vuelo.
            </p>

            <p>
              En esta página puedes consultar los aeropuertos disponibles en {city.name} y 
              acceder a los parqueaderos cercanos a cada terminal. Mostramos información clara 
              sobre precios por día, tipos de vehículo admitidos y opciones cubiertas o al aire libre.
            </p>

            <p>
              Nuestro objetivo es facilitar la búsqueda de parqueaderos en {city.name}, 
              permitiéndote contactar directamente con el operador para confirmar disponibilidad 
              y realizar tu reserva de forma rápida y segura.
            </p>
          </section>

          {/* Airport Cards */}
          <section>
            <h2 className="text-lg font-semibold mb-6">
              Aeropuertos disponibles en {city.name}
            </h2>

            {airports && airports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {airports.map((airport) => (
                  <div
                    key={airport.id}
                    className="rounded-xl border border-gray-200 bg-white overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="bg-blue-50 border-b border-blue-100 px-5 py-3 h-[72px] flex items-center justify-center text-center">
                      <div className="font-semibold text-base text-gray-900 line-clamp-2">
                        Aeropuerto {airport.name}
                      </div>
                    </div>

                    <div className="px-5 py-6 flex flex-col gap-4 flex-1 justify-between">
                      <p className="text-sm text-gray-600 text-center">
                        Consulta parqueaderos cercanos al Aeropuerto {airport.name}.
                      </p>

                      <div className="pt-3 flex justify-center">
                        <Link
                          href={`/aeropuerto/${airport.slug}`}
                          className="inline-flex items-center justify-center rounded-md bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 transition-all duration-200 shadow-sm hover:shadow"
                        >
                          Ver parqueaderos
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No hay aeropuertos registrados en esta ciudad.
              </p>
            )}
          </section>

          {/* Why Choose Section */}
          <section className="mt-16 mb-10 max-w-4xl space-y-6">
            <h2 className="text-xl font-semibold">
              ¿Por qué comparar parqueaderos en {city.name}?
            </h2>

            <div className="space-y-4 text-gray-700">
              <p>
                Comparar parqueaderos en {city.name} te permite evaluar precios, 
                niveles de seguridad y servicios adicionales antes de tomar una decisión. 
                Algunas opciones incluyen vigilancia permanente, control de acceso y transporte 
                hacia la terminal.
              </p>

              <p>
                Dependiendo del aeropuerto y la duración de tu viaje, puedes elegir 
                entre parqueaderos cubiertos o al aire libre, con diferentes rangos de precio. 
                Analizar estas variables te ayuda a encontrar la opción más conveniente.
              </p>

              <p>
                Centralizar la información en un solo lugar simplifica la búsqueda 
                y te permite reservar con mayor confianza y claridad.
              </p>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mt-16 mb-12 max-w-4xl space-y-6">
            <h2 className="text-xl font-semibold">
              Preguntas frecuentes sobre parqueaderos en {city.name}
            </h2>

            <div>
              <h3 className="font-semibold">
                ¿Dónde parquear cerca del aeropuerto en {city.name}?
              </h3>
              <p className="text-gray-600">
                Puedes comparar diferentes parqueaderos según ubicación, precio y servicios disponibles.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                ¿Hay parqueaderos cubiertos en {city.name}?
              </h3>
              <p className="text-gray-600">
                Sí, puedes encontrar opciones cubiertas y al aire libre dependiendo del aeropuerto.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                ¿Cómo comparar precios en {city.name}?
              </h3>
              <p className="text-gray-600">
                Selecciona el aeropuerto correspondiente y revisa las opciones disponibles con precios actualizados por día.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
