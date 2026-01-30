import type { Parking } from "../types";
import { ParkingCard } from "./ParkingCard";

interface ResultsListProps {
  parkings: Parking[];
}

export function ResultsList({ parkings }: ResultsListProps) {
  if (parkings.length === 0) {
    return (
      <section>
        <p>No parking options found.</p>
        <p>Try adjusting your date, time, or location.</p>
      </section>
    );
  }

  return (
    <section style={{ marginTop: 12 }}>
      {parkings.map((parking) => (
        <ParkingCard key={parking.id} parking={parking} />
      ))}
    </section>
  );

}