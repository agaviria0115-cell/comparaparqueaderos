import type { Metadata } from "next";
import ResultsClient from "./ResultsClient";

type Props = {
  searchParams: {
    city_id?: string;
    airport_id?: string;
  };
};

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  const { city_id, airport_id } = searchParams;

  // We cannot build a perfect SEO URL yet because IDs are used,
  // but we MUST still noindex the Results page.
  // Canonical will be upgraded later when slugs exist.

  if (city_id && airport_id) {
    return {
      robots: { index: false, follow: true },
    };
  }

  return {
    robots: { index: false, follow: true },
  };
}

export default function ResultsPage() {
  return <ResultsClient />;
}