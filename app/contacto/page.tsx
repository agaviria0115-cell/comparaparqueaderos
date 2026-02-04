/**
 * CONTACTO — Skeleton
 * URL: /contacto
 * SEO-safe, trust & contact page.
 */

export default function ContactoPage() {
  return (
    <main>
      {/* 1️⃣ Page intro */}
      <section>
        <h1>Contacto</h1>

        <p>
          Si tienes preguntas sobre Comparaparqueaderos o necesitas más
          información, puedes ponerte en contacto con nosotros.
        </p>
      </section>

      {/* 2️⃣ How to contact */}
      <section>
        <h2>¿Cómo contactarnos?</h2>

        <p>
          Actualmente, Comparaparqueaderos facilita el contacto directo entre
          usuarios y operadores de parqueaderos. Para consultas generales sobre
          la plataforma, puedes escribirnos al correo electrónico indicado a
          continuación.
        </p>
      </section>

      {/* 3️⃣ Contact details */}
      <section>
        <h2>Información de contacto</h2>

        <p>
          Correo electrónico:{" "}
          <a href="mailto:contacto@comparaparqueaderos.com">
            contacto@comparaparqueaderos.com
          </a>
        </p>
      </section>
    </main>
  );
}