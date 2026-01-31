import { Suspense } from "react";
import ResultsClient from "./ResultsClient";

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="p-6">Cargando resultados…</div>}>
      <ResultsClient />
    </Suspense>
  );
}