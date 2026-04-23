import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

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
          <a
            href="mailto:hola@comparaparqueaderos.com"
            className="block bg-gray-50 border border-gray-200 rounded-xl p-6 mb-4 hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Correo electrónico
            </h2>

            <p className="text-gray-700">
              Puedes escribirnos directamente a:
            </p>

            <p className="text-blue-600 font-medium mt-2">
              hola@comparaparqueaderos.com
            </p>
          </a>

          {/* WhatsApp Card */}
          <a
            href="https://wa.me/573058724251?text=Hola,%20tengo%20una%20consulta%20sobre%20Comparaparqueaderos"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-green-50 border border-green-200 rounded-xl p-6 mb-12 hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              WhatsApp
            </h2>

            <p className="text-gray-700">
              Escríbenos directamente por WhatsApp:
            </p>

            <p className="text-green-700 font-medium mt-2">
              +57 305 872 4251
            </p>
          </a>

          {/* Form Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Envíanos un mensaje
            </h2>

            <ContactForm />
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}