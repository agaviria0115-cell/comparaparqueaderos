import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

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
  "https://www.comparaparqueaderos.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),

  title: {
    default:
      "Parqueaderos cerca del aeropuerto en Colombia | ComparaParqueaderos",
    template: "%s | ComparaParqueaderos",
  },

  description:
    "Compara parqueaderos cerca de los principales aeropuertos de Colombia. Revisa precios por día, opciones cubiertas y al aire libre, y contacta directamente al operador sin intermediarios.",

  // 👇 ADD THIS BLOCK
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  
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

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8KHGNHS1GD"
          strategy="afterInteractive"
        />
        <Script id="ga4-script" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'G-8KHGNHS1GD');
          `}
        </Script>
      </head>

      <body className={`${font.className} antialiased bg-white text-gray-900`}>
        {children}
      </body>
    </html>
  );
}