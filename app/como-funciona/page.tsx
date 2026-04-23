import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@supabase/supabase-js";

/* =====================================================
   Metadata — SEO Optimized
===================================================== */

export const metadata: Metadata = {
  title:
    "Cómo Funciona Comparaparqueaderos | Reserva Parqueaderos en Aeropuertos",
  description:
    "Descubre cómo funciona Comparaparqueaderos. Compara precios, revisa servicios y contacta directamente parqueaderos cerca a aeropuertos en Colombia.",
  robots: {
    index: true,
    follow: true,
  },
};

/* =====================================================
   Page
===================================================== */

export default async function ComoFuncionaPage() {
  // ✅ Create Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // ✅ Fetch airports dynamically
  const { data: airports } = await supabase
    .from("airports")
    .select("name, slug")
    .order("name", { ascending: true });

  return (
    <>
      <Header />

      <main className="bg-white">
        <div className="mx-auto max-w-5xl px-5 py-12 md:py-16">

          {/* H1 */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            ¿Cómo Funciona Comparaparqueaderos?
          </h1>

          {/* SEO Intro */}
          <p className="text-lg text-gray-700 mb-8">
            Comparaparqueaderos te permite encontrar y comparar parqueaderos
            cerca a aeropuertos en Colombia de forma rápida y sencilla.
            Puedes revisar precios, servicios y contactar directamente al
            operador sin intermediarios.
          </p>

          {/* ================================
              STEP SECTION
          ================================= */}

          <div className="grid md:grid-cols-3 gap-6 mb-14">

            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 hover:shadow-md transition">
              <div className="text-3xl mb-3">🔍</div>
              <h2 className="text-xl font-semibold mb-3 text-gray-900">
                1. Busca tu aeropuerto
              </h2>
              <p className="text-gray-700">
                Selecciona la ciudad y el aeropuerto donde necesitas dejar tu
                vehículo. Indica fechas y tipo de vehículo.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 hover:shadow-md transition">
              <div className="text-3xl mb-3">💰</div>
              <h2 className="text-xl font-semibold mb-3 text-gray-900">
                2. Compara opciones
              </h2>
              <p className="text-gray-700">
                Revisa precios por día, servicios incluidos, distancia al
                aeropuerto y tipo de parqueadero (cubierto o al aire libre).
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 hover:shadow-md transition">
              <div className="text-3xl mb-3">📱</div>
              <h2 className="text-xl font-semibold mb-3 text-gray-900">
                3. Contacta directamente
              </h2>
              <p className="text-gray-700">
                Una vez elijas la mejor opción, podrás contactar al operador
                directamente para confirmar tu reserva.
              </p>
            </div>

          </div>

          {/* ================================
              WHY USE US
          ================================= */}

          <section className="mb-14">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              ¿Por qué usar Comparaparqueaderos?
            </h2>

            <ul className="space-y-4 text-gray-700">
              <li>✔ Comparación rápida de precios</li>
              <li>✔ Información clara sobre servicios incluidos</li>
              <li>✔ Contacto directo con el operador</li>
              <li>✔ Opciones cerca a los principales aeropuertos del país</li>
            </ul>
          </section>

          {/* ================================
              DYNAMIC AIRPORT LINKS (FIXED)
          ================================= */}

          <section className="mb-14">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Aeropuertos populares
            </h2>

            <p className="text-gray-700 mb-4">
              Puedes encontrar parqueaderos en:
            </p>

            <ul className="space-y-2">
              {airports && airports.length > 0 ? (
                airports.map((airport) => (
                  <li key={airport.slug}>
                    <Link
                      href={`/aeropuerto/${airport.slug}`}
                      className="text-blue-600 hover:underline"
                    >
                      Parqueaderos en el Aeropuerto {airport.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">
                  Próximamente más aeropuertos disponibles.
                </li>
              )}
            </ul>
          </section>

          {/* ================================
              FAQ
          ================================= */}

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Preguntas Frecuentes
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  ¿Comparaparqueaderos cobra comisión?
                </h3>
                <p className="text-gray-700">
                  No. Somos una plataforma informativa que facilita la
                  comparación y el contacto directo con operadores.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  ¿La reserva se hace dentro de la plataforma?
                </h3>
                <p className="text-gray-700">
                  Actualmente el contacto se realiza directamente con el
                  operador del parqueadero.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  ¿Los precios están actualizados?
                </h3>
                <p className="text-gray-700">
                  Trabajamos para mantener la información actualizada, pero
                  recomendamos confirmar directamente con el operador.
                </p>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}