import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://comparaparqueaderos.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),

  title: {
    default:
      "Parqueaderos cerca del aeropuerto en Colombia | ComparaParqueaderos",
    template: "%s | ComparaParqueaderos",
  },

  description:
    "Compara parqueaderos cerca de los principales aeropuertos de Colombia. Revisa precios por día, opciones cubiertas y al aire libre, y contacta directamente al operador sin intermediarios.",

  openGraph: {
    type: "website",
    locale: "es_CO",
    url: baseUrl,
    siteName: "ComparaParqueaderos",
    title:
      "Parqueaderos cerca del aeropuerto en Colombia | ComparaParqueaderos",
    description:
      "Compara parqueaderos cerca de los principales aeropuertos de Colombia. Precios claros, opciones cubiertas y contacto directo con el operador.",
    images: [
      {
        url: `${baseUrl}/aeropuerto-colombia-parqueaderos-hero.jpg`,
        width: 1200,
        height: 630,
        alt: "Parqueaderos cerca del aeropuerto en Colombia",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Parqueaderos cerca del aeropuerto en Colombia | ComparaParqueaderos",
    description:
      "Compara parqueaderos oficiales y privados cerca de aeropuertos en Colombia.",
    images: [`${baseUrl}/aeropuerto-colombia-parqueaderos-hero.jpg`],
  },

  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}