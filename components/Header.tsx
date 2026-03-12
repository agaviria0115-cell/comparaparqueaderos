"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * HEADER — Global
 * Desktop navigation + mobile left drawer
 */

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="bg-gray-50 border-b border-gray-200 relative z-50">
        <div className="mx-auto max-w-7xl px-6 py-4 relative flex items-center">

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-700"
            aria-label="Abrir menú"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Centered logo on mobile */}
          <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 font-bold text-lg text-blue-700">
            <Link href="/" className="hover:opacity-80 transition">
              Comparaparqueaderos
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex ml-auto gap-8 text-sm text-gray-700 font-medium">
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

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 md:hidden z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        md:hidden z-50
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Drawer header */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">

          <div className="font-semibold text-blue-700 text-base">
            Comparaparqueaderos
          </div>

          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            className="text-gray-600 hover:text-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col text-sm font-medium text-gray-700 px-6 py-6">

          <Link
            href="/como-funciona"
            className="py-2 hover:text-blue-600"
            onClick={() => setOpen(false)}
          >
            Cómo Funciona
          </Link>

          <Link
            href="/contacto"
            className="py-2 hover:text-blue-600"
            onClick={() => setOpen(false)}
          >
            Contacto
          </Link>

          {/* Explore section */}
          <div className="mt-6 mb-2 text-xs uppercase tracking-wide text-gray-400">
            Explorar
          </div>

          <Link
            href="/ciudad/medellin"
            className="py-2 hover:text-blue-600"
            onClick={() => setOpen(false)}
          >
            Parqueaderos en Medellín
          </Link>

          <Link
            href="/aeropuerto/jose-maria-cordova"
            className="py-2 hover:text-blue-600"
            onClick={() => setOpen(false)}
          >
            Aeropuerto José María Córdova
          </Link>

        </nav>
      </div>
    </>
  );
}