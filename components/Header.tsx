import Link from "next/link";

/**
 * HEADER — Global
 * Clean navigation for production
 */

export default function Header() {
  return (
    <header className="bg-gray-50 border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        
        {/* Brand */}
        <div className="font-bold text-lg text-blue-700">
          <Link href="/" className="hover:opacity-80 transition">
            Comparaparqueaderos
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex gap-8 text-sm text-gray-700 font-medium">
          <Link
            href="/como-funciona"
            className="hover:text-blue-600 transition"
          >
            Cómo Funciona
          </Link>

          <Link
            href="/contacto"
            className="hover:text-blue-600 transition"
          >
            Contacto
          </Link>
        </nav>
      </div>
    </header>
  );
}