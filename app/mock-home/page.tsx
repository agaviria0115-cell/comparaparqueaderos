"use client";

// MOCK HOMEPAGE — VISUAL SANDBOX ONLY
// --------------------------------------------------
// Purpose:
// - Design & iterate on the TOP LAYER (layout, colors, typography)
// - NO real logic, NO Supabase, NO routing, NO SEO metadata
// - Safe playground to finalize look & feel before translating to real Home page
//
// Location (recommended):
// app/_mock/home-design/page.tsx

import React from "react";
import SearchForm from "@/components/SearchForm";

export default function MockHomeDesign() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* HEADER */}
      <header className="bg-gray-50 text-gray-900 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="font-bold text-lg text-blue-700">
            ComparaParqueaderos
          </div>
          <nav className="hidden md:flex gap-6 text-sm">
            <span className="opacity-90">Cómo funciona</span>
            <span className="opacity-90">Parqueaderos</span>
            <span className="opacity-90">Contacto</span>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative bg-blue-700">
        {/* VISUAL LAYER */}
        <div className="absolute inset-0">
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage: "url('/mock-airport-hero.jpg')",
              backgroundPosition: "center bottom",
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-blue-900/70" />
        </div>

        {/* CONTENT */}
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-8">
          {/* TEXT */}
          <div className="mx-auto mb-12 max-w-2xl text-center text-white">
            <h1 className="mb-5 text-4xl font-extrabold leading-tight md:text-5xl drop-shadow-sm">
              Parqueaderos cerca del{" "}
              <span className="text-yellow-400">aeropuerto</span>
            </h1>

            <p className="mb-10 text-base text-blue-100 md:text-lg leading-relaxed">
              Encuentra y compara parqueaderos oficiales y privados cerca de los
              principales aeropuertos de Colombia al mejor preciosin sorpresas.
            </p>
          </div>

          {/* SEARCH FORM (REAL COMPONENT) */}
          <div className="mx-auto max-w-6xl rounded-xl bg-white p-5 shadow-2xl ring-1 ring-black/5">
            <SearchForm />
          </div>

          {/* SPACE FROM BOTTOM OF HERO */}
          <div className="h-10 md:h-14" />
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-1 font-semibold text-gray-900">Precios claros</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Compara tarifas finales sin costos ocultos.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-gray-900">Cerca del aeropuerto</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Parqueaderos oficiales y privados verificados.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-gray-900">Reserva fácil</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Contacta directamente al operador por WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* SEO INTRO CONTENT */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start">
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
              aeroportuarios en ciudades como Bogotá, Medellín, Cali y otras,
              ayudándote a reservar directamente con el operador a través de
              WhatsApp de manera sencilla y segura.
            </p>
          </div>

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

      {/* HOW IT WORKS */}
      <section className="bg-white border-t border-gray-100">
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
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
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
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
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
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
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

      {/* POPULAR AIRPORTS & CITIES */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-12 max-w-2xl">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Parqueaderos en aeropuertos de Colombia
            </h2>

            <p className="text-base text-gray-700">
              Encuentra parqueaderos cerca de los aeropuertos más importantes de
              Colombia. Compara opciones disponibles en cada ciudad y elige la
              alternativa que mejor se adapte a tu viaje.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
                Aeropuertos principales
              </h3>
              <ul className="space-y-3 text-sm text-blue-700">
                <li>Parqueaderos Aeropuerto El Dorado (Bogotá)</li>
                <li>Parqueaderos Aeropuerto José María Córdova (Medellín)</li>
                <li>Parqueaderos Aeropuerto Alfonso Bonilla Aragón (Cali)</li>
                <li>Parqueaderos Aeropuerto Rafael Núñez (Cartagena)</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
                Ciudades populares
              </h3>
              <ul className="space-y-3 text-sm text-blue-700">
                <li>Parqueaderos en Bogotá</li>
                <li>Parqueaderos en Medellín</li>
                <li>Parqueaderos en Cali</li>
                <li>Parqueaderos en Cartagena</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
                Próximamente
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Estamos ampliando la cobertura para incluir más aeropuertos y
                ciudades en Colombia, con nuevas opciones de parqueaderos y
                servicios adicionales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            {/* Section title */}
            <h2 className="mb-12 text-2xl font-bold text-gray-900 md:text-3xl">
              Preguntas frecuentes sobre parqueaderos cerca del aeropuerto
            </h2>

            {/* FAQ list */}
            <div className="space-y-8">
              {/* FAQ item 1 */}
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

              {/* FAQ item 2 */}
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

              {/* FAQ item 3 */}
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

              {/* FAQ item 4 */}
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

      {/* FOOTER */}
      <footer className="bg-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-gray-600 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} ComparaParqueaderos</span>
          <div className="flex gap-4">
            <span>Términos</span>
            <span>Privacidad</span>
            <span>Contacto</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
