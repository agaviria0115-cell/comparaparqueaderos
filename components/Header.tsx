import Link from "next/link";

/**
 * HEADER — Placeholder
 * SEO-safe, structure-only.
 * No final styling or navigation decisions.
 */

export default function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link href="/">Comparaparqueaderos</Link>
          </li>

          <li>
            <Link href="/">Buscar parqueadero</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}