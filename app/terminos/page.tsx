import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* =====================================================
   Metadata — SEO Optimized
===================================================== */

export const metadata: Metadata = {
  title: "Términos y Condiciones | Comparaparqueaderos",
  description:
    "Consulta los términos y condiciones de uso de Comparaparqueaderos. Información sobre el servicio, responsabilidades, limitaciones y contacto.",
  robots: {
    index: true,
    follow: true,
  },
};

/* =====================================================
   Page
===================================================== */

export default function TerminosPage() {
  return (
    <>
      <Header />

      <main className="bg-white">
        <div className="mx-auto max-w-5xl px-5 py-12 md:py-16">

          {/* Page Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Términos y Condiciones
          </h1>

          {/* Intro */}
          <p className="text-gray-700 text-lg mb-8">
            Al utilizar Comparaparqueaderos aceptas los siguientes términos y
            condiciones. Te recomendamos leerlos cuidadosamente antes de usar
            nuestra plataforma.
          </p>

          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Sobre el servicio
            </h2>

            <p className="text-gray-700 mb-4">
              Comparaparqueaderos es una plataforma informativa que permite
              comparar parqueaderos cercanos a aeropuertos en Colombia.
            </p>

            <p className="text-gray-700">
              No operamos parqueaderos ni gestionamos reservas directamente.
              Nuestro objetivo es facilitar el contacto entre usuarios y
              operadores de parqueaderos.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Información publicada
            </h2>

            <p className="text-gray-700 mb-4">
              La información de precios, servicios, disponibilidad y
              características de cada parqueadero es proporcionada por los
              operadores.
            </p>

            <p className="text-gray-700">
              Aunque buscamos mantener la información actualizada, no
              garantizamos que los datos estén libres de errores o cambios
              posteriores por parte del operador.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Responsabilidad del usuario
            </h2>

            <p className="text-gray-700 mb-4">
              El usuario es responsable de verificar directamente con el
              operador del parqueadero cualquier detalle relacionado con
              precios, horarios, disponibilidad y condiciones del servicio.
            </p>

            <p className="text-gray-700">
              Comparaparqueaderos no se hace responsable por cambios en tarifas,
              políticas internas del operador o situaciones ocurridas durante el
              servicio prestado por terceros.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Limitación de responsabilidad
            </h2>

            <p className="text-gray-700">
              Comparaparqueaderos actúa únicamente como plataforma de conexión
              entre usuarios y operadores. No somos responsables por daños,
              pérdidas, retrasos o inconvenientes derivados del servicio
              contratado directamente con el parqueadero.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Modificaciones
            </h2>

            <p className="text-gray-700">
              Nos reservamos el derecho de actualizar estos términos en
              cualquier momento. El uso continuado de la plataforma implica la
              aceptación de cualquier modificación realizada.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}