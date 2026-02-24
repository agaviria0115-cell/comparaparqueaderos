import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* =====================================================
   Metadata — SEO Optimized
===================================================== */

export const metadata: Metadata = {
  title: "Contacto | Comparaparqueaderos",
  description:
    "Contáctanos para consultas, alianzas o soporte. Estamos disponibles para ayudarte con información sobre parqueaderos en aeropuertos en Colombia.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactoPage() {
  return (
    <>
      <Header />

      <main className="bg-white">
        <div className="mx-auto max-w-5xl px-5 py-12 md:py-16">

          {/* H1 */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Contáctanos
          </h1>

          {/* Intro */}
          <p className="text-lg text-gray-700 mb-8">
            Si tienes preguntas, sugerencias o deseas publicar tu parqueadero
            en nuestra plataforma, puedes escribirnos. Estaremos atentos para
            ayudarte.
          </p>

          {/* Contact Info Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Correo electrónico
            </h2>

            <p className="text-gray-700">
              Puedes escribirnos directamente a:
            </p>

            <a
              href="mailto:hola@comparaparqueaderos.com"
              className="text-blue-600 font-medium hover:underline block mt-2"
            >
              hola@comparaparqueaderos.com
            </a>
          </div>

          {/* Form Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Envíanos un mensaje
            </h2>

            <form className="space-y-6 max-w-xl">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  rows={5}
                  placeholder="Escribe tu mensaje aquí..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Button */}
              <button
                type="button"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Enviar mensaje
              </button>

            </form>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}