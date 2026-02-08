export const dynamic = "force-dynamic";
import { Suspense } from "react";
import ResultsClient from "./ResultsClient";

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Cargando resultados...</div>}>
      <ResultsClient />
    </Suspense>
  );
}
