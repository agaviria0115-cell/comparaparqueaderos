"use client";

// MOCK HOMEPAGE v2 — HERO WITH IMAGE + OVERLAY (SAFE)
// --------------------------------------------------
// Purpose:
// - Visual sandbox for hero design
// - Background image with semi-transparent overlay
// - Gradient fallback so hero is NEVER blank
// - NO search box
// - NO logic, NO Supabase, NO routing, NO SEO
//
// Image expected at:
// public/images/mock-airport-hero.jpg
//
// You can change the path freely.

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* -----------------------------
          HEADER (MOCK)
         ----------------------------- */}
      <header className="bg-gray-50 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="font-bold text-lg text-blue-700">
            Comparaparqueaderos
          </div>
          <nav className="hidden md:flex gap-6 text-sm">
            <span className="opacity-90">Cómo funciona</span>
            <span className="opacity-90">Parqueaderos</span>
            <span className="opacity-90">Contacto</span>
          </nav>
        </div>
      </header>

      {/* -----------------------------
          HERO SECTION
         ----------------------------- */}
      <section className="relative overflow-hidden">
        {/* Fallback gradient (always visible) */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-blue-900" />

        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/mock-airport-hero.jpg')",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-blue-900/70" />

        {/* Hero content container — intentionally EMPTY */}
        <div className="relative mx-auto max-w-7xl px-6 py-28">
          {/* 
            No search box here.
            This hero is visual-only for now.
          */}
        </div>
      </section>

      {/* -----------------------------
          TRUST / INFO STRIP
         ----------------------------- */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <h3 className="font-semibold">Precios claros</h3>
            <p className="text-sm text-gray-600">
              Compara tarifas finales sin costos ocultos.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Cerca del aeropuerto</h3>
            <p className="text-sm text-gray-600">
              Parqueaderos oficiales y privados verificados.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Reserva fácil</h3>
            <p className="text-sm text-gray-600">
              Contacta directamente al operador por WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* -----------------------------
          FOOTER (MOCK)
         ----------------------------- */}
      <footer className="bg-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-gray-600 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Comparaparqueaderos</span>
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
