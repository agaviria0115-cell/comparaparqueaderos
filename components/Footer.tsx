import Link from "next/link";

/**
 * FOOTER — Placeholder
 * SEO-safe, structure-only.
 * Content will be expanded later.
 */

export default function Footer() {
  return (
    <footer>
      <nav>
        <ul>
          <li>
            <strong>Ciudades</strong>
          </li>
          <li>
            <Link href="/parqueaderos/bogota">Bogotá</Link>
          </li>
          <li>
            <Link href="/parqueaderos/medellin">Medellín</Link>
          </li>
          <li>
            <Link href="/parqueaderos/cali">Cali</Link>
          </li>
        </ul>

        <ul>
          <li>
            <strong>Aeropuertos</strong>
          </li>
          <li>
            <Link href="/parqueaderos/bogota/aeropuerto-el-dorado">
              Aeropuerto El Dorado
            </Link>
          </li>
          <li>
            <Link href="/parqueaderos/medellin/aeropuerto-jmc">
              Aeropuerto José María Córdova
            </Link>
          </li>
          <li>
            <Link href="/parqueaderos/cali/alfonso-bonilla">
              Aeropuerto Alfonso Bonilla Aragón
            </Link>
          </li>
        </ul>

        <ul>
          <li>
            <strong>Información</strong>
          </li>
          <li>
            <Link href="/como-funciona">Cómo funciona</Link>
          </li>
          <li>
            <Link href="/contacto">Contacto</Link>
          </li>
        </ul>

        <ul>
          <li>
            <strong>Legal</strong>
          </li>
          <li>
            <Link href="/terminos">Términos y condiciones</Link>
          </li>
          <li>
            <Link href="/privacidad">Política de privacidad</Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}