import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* =====================================================
   Metadata — SEO Optimized
===================================================== */

export const metadata: Metadata = {
  title: "Política de Privacidad | Comparaparqueaderos",
  description:
    "Conoce cómo recopilamos, usamos y protegemos tu información personal en Comparaparqueaderos. Transparencia y seguridad en el manejo de datos.",
  robots: {
    index: true,
    follow: true,
  },
};

/* =====================================================
   Page
===================================================== */

export default function PoliticaPrivacidadPage() {
  return (
    <>
      <Header />

      <main className="bg-white">
        <div className="mx-auto max-w-5xl px-5 py-12 md:py-16">

          {/* Page Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Política de Privacidad
          </h1>

          {/* Intro */}
          <p className="text-gray-700 text-lg mb-8">
            En Comparaparqueaderos valoramos tu privacidad y nos comprometemos
            a proteger la información personal que compartes con nosotros.
            Esta política explica cómo recopilamos, usamos y protegemos tus datos.
          </p>

          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Información que recopilamos
            </h2>

            <p className="text-gray-700 mb-4">
              Podemos recopilar información como nombre, número de teléfono,
              correo electrónico y datos relacionados con tu reserva cuando
              utilizas nuestra plataforma.
            </p>

            <p className="text-gray-700">
              También podemos recopilar información técnica como dirección IP,
              tipo de navegador y datos de navegación con fines analíticos y
              de mejora del servicio.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Uso de la información
            </h2>

            <p className="text-gray-700 mb-4">
              Utilizamos la información recopilada para facilitar la conexión
              entre usuarios y operadores de parqueaderos, mejorar la experiencia
              del usuario y optimizar nuestros servicios.
            </p>

            <p className="text-gray-700">
              No vendemos ni compartimos tu información personal con terceros
              con fines comerciales.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Compartición de datos
            </h2>

            <p className="text-gray-700 mb-4">
              En caso de que el usuario decida contactar directamente a un
              operador de parqueadero, la información proporcionada podrá ser
              compartida con dicho operador únicamente para gestionar la
              solicitud.
            </p>

            <p className="text-gray-700">
              También podemos compartir información cuando sea requerido por
              ley o autoridad competente.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Seguridad de la información
            </h2>

            <p className="text-gray-700">
              Implementamos medidas técnicas y organizativas razonables para
              proteger tu información contra accesos no autorizados, pérdida
              o alteración.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Derechos del usuario
            </h2>

            <p className="text-gray-700">
              De acuerdo con la legislación colombiana, el usuario tiene
              derecho a conocer, actualizar y rectificar sus datos personales.
              Para ejercer estos derechos puedes contactarnos a través de los
              canales oficiales publicados en nuestra plataforma.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Modificaciones
            </h2>

            <p className="text-gray-700">
              Nos reservamos el derecho de actualizar esta política en cualquier
              momento. Las modificaciones serán publicadas en esta misma página.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}