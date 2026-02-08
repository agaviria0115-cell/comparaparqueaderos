import Link from "next/link";

/**
 * HEADER — Global
 * SEO-safe, structure-first implementation.
 * Desktop nav visible, mobile minimal.
 */

export default function Header() {
  return (
    <header className="bg-gray-50 border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <div className="font-bold text-lg text-blue-700">
          <Link href="/">ComparaParqueaderos</Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex gap-6 text-sm text-gray-700">
          <Link href="#como-funciona" className="hover:underline">
            Cómo funciona
          </Link>
          <Link href="#parqueaderos" className="hover:underline">
            Parqueaderos
          </Link>
          <Link href="#contacto" className="hover:underline">
            Contacto
          </Link>
        </nav>
      </div>
    </header>
  );
}
