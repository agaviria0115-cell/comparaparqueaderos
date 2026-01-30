import { ResultsHeader } from "./components/ResultsHeader";
import { ResultsClient } from "./components/ResultsClient";
import type { Parking } from "./types";
import { supabase } from "../lib/supabase";

interface SearchParams {
  lat?: string;
  lng?: string;
  start?: string;
  end?: string;
  vehicle?: string;
}

/**
 * Compute hours between two ISO date strings
 */
function hoursBetween(start?: string, end?: string): number {
  if (!start || !end) return 0;

  const startDate = new Date(start);
  const endDate = new Date(end);

  const diffMs = endDate.getTime() - startDate.getTime();
  if (diffMs <= 0) return 0;

  return diffMs / (1000 * 60 * 60);
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  /* ----------------------------
     Read URL params
  ----------------------------- */
  const params = await searchParams;

  const vehicle = params.vehicle;
  const start = params.start;
  const end = params.end;

  /* ----------------------------
     Compute duration (days billed)
  ----------------------------- */
  const durationHours = hoursBetween(start, end);
  const durationDays =
    durationHours > 0 ? Math.ceil(durationHours / 24) : 0;

  /* ----------------------------
     Fetch parkings from Supabase
  ----------------------------- */
  const { data, error } = await supabase
    .from("parkings")
    .select(`
      id,
      name,
      price_per_day,
      is_covered,
      has_shuttle
    `)
    .eq("is_active", true);

  if (error) {
    console.error("Supabase error:", error.message);
  }

  /* ----------------------------
     Map DB rows → Parking[]
  ----------------------------- */
  const parkings: Parking[] =
    data?.map((row) => {
      const pricePerDay = row.price_per_day ?? 0;
      const totalPrice =
        durationDays > 0 ? durationDays * pricePerDay : 0;

      return {
        id: row.id,
        name: row.name,
        distanceMeters: 0, // placeholder (distance comes later)
        totalPrice,
        tags: [
          row.is_covered ? "Covered" : null,
          row.has_shuttle ? "Shuttle" : null,
        ].filter(Boolean) as string[],
      };
    }) ?? [];

  /* ----------------------------
     Render
  ----------------------------- */
  return (
    <main>
      <ResultsHeader
        parkingsCount={parkings.length}
        vehicle={vehicle}
        start={start}
        end={end}
      />

      {/* Client-side sorting + list */}
      <ResultsClient parkings={parkings} />
    </main>
  );
}
