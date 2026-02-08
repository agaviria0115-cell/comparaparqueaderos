import Link from "next/link";

/**
 * FOOTER — SEO-safe, launch version
 * Reflects current live coverage only (Medellín + JMC).
 * Expanded later as more cities/airports are added.
 */

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <nav className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Cities */}
          <ul className="space-y-3 text-sm">
            <li className="font-semibold text-gray-900">
              Ciudades
            </li>
            <li>
              <Link
                href="/ciudad/medellin"
                className="text-gray-600 hover:text-blue-700"
              >
                Parqueaderos en Medellín
              </Link>
            </li>
          </ul>

          {/* Airports */}
          <ul className="space-y-3 text-sm">
            <li className="font-semibold text-gray-900">
              Aeropuertos
            </li>
            <li>
              <Link
                href="/aeropuerto/jose-maria-cordova"
                className="text-gray-600 hover:text-blue-700"
              >
                Aeropuerto José María Córdova
              </Link>
            </li>
          </ul>

          {/* Information */}
          <ul className="space-y-3 text-sm">
            <li className="font-semibold text-gray-900">
              Información
            </li>
            <li>
              <Link
                href="/como-funciona"
                className="text-gray-600 hover:text-blue-700"
              >
                Cómo funciona
              </Link>
            </li>
            <li>
              <Link
                href="/contacto"
                className="text-gray-600 hover:text-blue-700"
              >
                Contacto
              </Link>
            </li>
          </ul>

          {/* Legal */}
          <ul className="space-y-3 text-sm">
            <li className="font-semibold text-gray-900">
              Legal
            </li>
            <li>
              <Link
                href="/terminos"
                className="text-gray-600 hover:text-blue-700"
              >
                Términos y condiciones
              </Link>
            </li>
            <li>
              <Link
                href="/privacidad"
                className="text-gray-600 hover:text-blue-700"
              >
                Política de privacidad
              </Link>
            </li>
          </ul>
        </nav>

        {/* Bottom line */}
        <div className="mt-10 text-xs text-gray-500">
          © {new Date().getFullYear()} ComparaParqueaderos
        </div>
      </div>
    </footer>
  );
}
