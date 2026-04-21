import Link from "next/link";
import SearchForm from "@/components/SearchForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import type { Metadata } from "next";

/**
 * HOME PAGE — STEP 7.1
 * SEO-first, structure-only implementation.
 * No visual polish, no extra components.
 */

export const metadata: Metadata = {
  title: "Parqueaderos cerca del aeropuerto en Colombia",
  description:
    "Compara parqueaderos oficiales y privados cerca de los principales aeropuertos de Colombia. Revisa precios por día, servicios incluidos y reserva directamente con el operador.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        {/* 2️⃣ Search + Hero text (no background) */}
        <section className="bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-10 md:py-12">

            {/* Card styled like design */}
            <div className="mx-auto max-w-full rounded-2xl bg-white p-5 md:p-10 shadow-md ring-1 ring-gray-200">

              {/* Hero text INSIDE card */}
              <div className="mb-6 w-full text-left">
                <h1 className="mb-2 text-2xl font-semibold tracking-tight leading-tight md:text-4xl text-gray-900">
                  Encuentra y compara parqueaderos
                  <br />
                  <span className="text-blue-600">cerca del aeropuerto</span>
                </h1>

                <p className="text-sm text-gray-600 md:text-base leading-relaxed max-w-xl md:max-w-none md:whitespace-nowrap">
                  compara parqueaderos oficiales y privados cerca de los principales aeropuertos de Colombia al mejor precio
                </p>
              </div>

              {/* Search form */}
              <div className="rounded-xl bg-white p-4 md:p-5 mt-4">
                <SearchForm />
              </div>

            </div>

          </div>
        </section>

        {/* 4️⃣ Why compare with us */}
        <section className="bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 py-8">

            {/* Title */}
            <h2 className="text-center text-2xl md:text-3xl font-semibold text-gray-900 mb-12">
              ¿Por qué comparar con nosotros?
            </h2>

            {/* Features */}
            <div className="grid grid-cols-1 gap-10 text-left md:grid-cols-4 md:gap-8">

              {/* Item 1 */}
              <div className="flex flex-col items-start">
                <div className="mb-4 flex h-14 w-14 items-center justify-center self-start rounded-full bg-blue-50 text-blue-600 text-xl">
                  $
                </div>
                <h3 className="mb-2 font-semibold text-lg text-gray-900">
                  Mejores precios
                </h3>
                <p className="text-sm text-gray-600 max-w-xs">
                  Encuentra las mejores tarifas disponibles.
                </p>
              </div>

              {/* Item 2 */}
              <div className="flex flex-col items-start">
                <div className="mb-4 flex h-14 w-14 items-center justify-center self-start rounded-full bg-blue-50 text-blue-600 text-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-7.75-7-13a7 7 0 1114 0c0 5.25-7 13-7 13z"/><circle cx="12" cy="9" r="2.5" /></svg>
                </div>
                <h3 className="mb-2 font-semibold text-lg text-gray-900">
                  Ubicaciones cercanas
                </h3>
                <p className="text-sm text-gray-600 max-w-xs">
                  Opciones cerca de los principales aeropuertos de tu cuidad.
                </p>
              </div>

              {/* Item 3 */}
              <div className="flex flex-col items-start">
                <div className="mb-4 flex h-14 w-14 items-center justify-center self-start rounded-full bg-blue-50 text-blue-600 text-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="h-6 w-6"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                </div>
                <h3 className="mb-2 font-semibold text-lg text-gray-900">
                  Precios actualizados
                </h3>
                <p className="text-sm text-gray-600 max-w-xs">
                  Información actualizada para que tomes la mejor decisión.
                </p>
              </div>

              {/* Item 4 */}
              <div className="flex flex-col items-start">
                <div className="mb-4 flex h-14 w-14 items-center justify-center self-start rounded-full bg-blue-50 text-blue-600 text-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="h-6 w-6"><path d="M12 3l7 4v5c0 5-3.582 9.74-7 11-3.418-1.26-7-6-7-11V7l7-4z"/></svg>
                </div>
                <h3 className="mb-2 font-semibold text-lg text-gray-900">
                  Seguridad garantizada
                </h3>
                <p className="text-sm text-gray-600 max-w-xs">
                  Parqueaderos verificados y confiables.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 5️⃣ SEO intro content */}
        <section className="bg-gray-50 border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
              
              {/* LEFT — TEXT */}
              <div className="max-w-2xl">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                  Comparador de parqueaderos cerca del aeropuerto
                </h2>

                <p className="mb-6 text-base text-gray-700 leading-relaxed">
                  ComparaParqueaderos te permite encontrar y comparar parqueaderos
                  cerca de los principales aeropuertos de Colombia de forma rápida
                  y transparente. Reunimos opciones oficiales y privadas para que
                  puedas elegir el parqueadero que mejor se adapte a tu viaje,
                  presupuesto y tipo de vehículo.
                </p>

                <p className="mb-4 text-base text-gray-700">
                  Al comparar parqueaderos cercanos al aeropuerto, puedes evaluar
                  precios por día, servicios como transporte en shuttle, opciones
                  cubiertas o al aire libre, y la distancia real hasta la terminal.
                  Toda la información se muestra de forma clara, sin costos ocultos
                  ni intermediarios.
                </p>

                <p className="text-base text-gray-700">
                  Nuestro objetivo es facilitar la búsqueda de parqueaderos
                  aeroportuarios. Actualmente operamos en{" "}
                  <Link
                    href="/ciudad/medellin"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Medellín
                  </Link>{" "}
                  (Aeropuerto{" "}
                  <Link
                    href="/aeropuerto/jose-maria-cordova"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    José María Córdova
                  </Link>
                  ), ayudándote a reservar directamente con el operador a través de
                  WhatsApp de manera sencilla y segura.
                </p>
              </div>

              {/* RIGHT — IMAGE (DESKTOP ONLY) */}
              <div className="hidden md:block md:pt-2">
                <img
                  src="/parqueaderos-cerca-aeropuerto-colombia.jpg"
                  alt="Parqueaderos cerca del aeropuerto en Colombia"
                  className="w-full max-w-md rounded-lg object-cover shadow-sm"
                />
              </div>

            </div>
          </div>
        </section>

        {/* 7️⃣ How it works */}
        <section className="bg-gray-50 border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="mb-12 max-w-3xl">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                ¿Cómo funciona ComparaParqueaderos?
              </h2>

              <p className="text-base text-gray-700">
                Comparar y reservar un parqueadero cerca del aeropuerto es sencillo.
                Solo sigue estos pasos:
              </p>
            </div>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
              <div className="max-w-sm">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                    1
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Ingresa los detalles de tu viaje
                  </h3>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">
                  Selecciona la ciudad, el aeropuerto, las fechas y el tipo de
                  vehículo para ver las opciones disponibles cerca del aeropuerto.
                </p>
              </div>

              <div className="max-w-sm">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                    2
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Compara parqueaderos
                  </h3>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">
                  Compara precios por día, ubicación, servicios incluidos y
                  condiciones de cada parqueadero de forma clara y transparente.
                </p>
              </div>

              <div className="max-w-sm">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                    3
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Contacta y reserva directamente
                  </h3>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">
                  Elige el parqueadero que mejor se adapte a tu viaje y contacta
                  directamente al operador por WhatsApp para completar tu reserva.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8️⃣ FAQ section */}
        <section className="bg-gray-50 border-t border-gray-200">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="max-w-3xl">
              <h2 className="mb-12 text-2xl font-bold text-gray-900 md:text-3xl">
                Preguntas frecuentes sobre parqueaderos cerca del aeropuerto
              </h2>

              <div className="space-y-8">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    ¿Cuánto cuesta dejar el carro en un parqueadero cerca del aeropuerto?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    El precio depende del aeropuerto, la duración de la estadía y los
                    servicios incluidos. En ComparaParqueaderos puedes comparar precios
                    diarios de parqueaderos oficiales y privados, con tarifas claras y
                    sin costos ocultos.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    ¿Es seguro dejar el vehículo en un parqueadero privado?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Sí, siempre que sea un parqueadero verificado. Mostramos opciones con
                    vigilancia, control de acceso y experiencia operando cerca de los
                    principales aeropuertos de Colombia.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    ¿Los parqueaderos incluyen transporte al aeropuerto?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Muchos parqueaderos ofrecen servicio de shuttle o traslado hasta la
                    terminal. Esta información se muestra claramente para que compares y
                    elijas la mejor opción según tus necesidades.
                  </p>
                </div>

                <div className="pb-6">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    ¿Cómo funciona la reserva del parqueadero?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Solo debes ingresar tu ciudad, aeropuerto y fechas. Al comparar
                    opciones, puedes contactar directamente al operador del parqueadero
                    por WhatsApp para confirmar disponibilidad y reservar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
