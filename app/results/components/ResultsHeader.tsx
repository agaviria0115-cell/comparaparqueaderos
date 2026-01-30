interface ResultsHeaderProps {
  parkingsCount: number;
  vehicle?: string;
  start?: string;
  end?: string;
}

export function ResultsHeader({
  parkingsCount,
  vehicle,
  start,
  end,
}: ResultsHeaderProps) {
  return (
    <section style={{ marginBottom: 20 }}>
      <h2 style={{ marginBottom: 6 }}>
        Parking options near you
      </h2>

      <p style={{ fontSize: 14, color: "#666" }}>
        {parkingsCount} resultados
        {vehicle ? ` • ${vehicle}` : ""}
        {start && end ? ` • ${start} → ${end}` : ""}
      </p>
    </section>
  );
}