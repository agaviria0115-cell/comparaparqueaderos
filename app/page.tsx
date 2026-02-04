import Link from "next/link";
import HomeHero from "@/components/HomeHero";
import SearchForm from "@/components/SearchForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * HOME PAGE — STEP 7.1
 * SEO-first, structure-only implementation.
 * No visual polish, no extra components.
 */

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        {/* 2️⃣ Hero section */}
        <section className="mb-16">
          <HomeHero />
        </section>

        {/* 3️⃣ Search component */}
        <section className="mb-16">
          <SearchForm />
        </section>

        {/* 4️⃣ Trust & reassurance strip */}
        <section className="mb-16">
          <ul className="flex flex-wrap gap-6">
            <li>Precios claros</li>
            <li>Contacto directo con el parqueadero</li>
            <li>Sin cargos ocultos</li>
          </ul>
        </section>

        {/* 5️⃣ SEO intro content */}
        <section className="mb-16">
          <h2 className="mb-6">Parqueaderos en aeropuertos de Colombia</h2>

          <p className="mb-4">
            Comparaparqueaderos te permite encontrar y comparar parqueaderos
            cercanos a los principales aeropuertos del país.
          </p>

          <p className="mb-4">
            En un solo lugar puedes revisar precios, servicios y condiciones
            antes de contactar directamente al parqueadero.
          </p>
        </section>

        {/* 6️⃣ Popular airports / cities */}
        <section className="mb-16">
          <h2 className="mb-6">Aeropuertos más buscados</h2>

          <ul>
            <li className="mb-2">
              <Link href="/parqueaderos/bogota/aeropuerto-el-dorado">
                Parqueaderos en el Aeropuerto El Dorado (Bogotá)
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/parqueaderos/medellin/aeropuerto-jmc">
                Parqueaderos en el Aeropuerto José María Córdova
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/parqueaderos/cali/alfonso-bonilla">
                Parqueaderos en el Aeropuerto Alfonso Bonilla Aragón
              </Link>
            </li>
          </ul>
        </section>

        {/* 7️⃣ How it works */}
        <section className="mb-16">
          <h2 className="mb-6">¿Cómo funciona Comparaparqueaderos?</h2>

          <ol>
            <li className="mb-2">Busca y compara parqueaderos cerca del aeropuerto</li>
            <li className="mb-2">Revisa precios, servicios y ubicación</li>
            <li className="mb-2">Reserva directamente por WhatsApp</li>
          </ol>
        </section>

        {/* 8️⃣ Secondary SEO block */}
        <section className="mb-16">
          <h2 className="mb-6">¿Por qué comparar parqueaderos cerca del aeropuerto?</h2>

          <p className="mb-4">
            Comparar te ayuda a encontrar mejores precios, evaluar servicios
            como transporte o cobertura, y elegir la opción más conveniente
            según tu viaje.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
