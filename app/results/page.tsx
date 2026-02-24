export const dynamic = "force-dynamic";

export const metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

import { Suspense } from "react";
import ResultsClient from "./ResultsClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ResultsPage() {
  return (
    <>
      <Header />

      <Suspense fallback={<div className="max-w-5xl mx-auto px-5 py-6">Cargando resultados…</div>}>
        <ResultsClient />
      </Suspense>

      <Footer />
    </>
  );
}
