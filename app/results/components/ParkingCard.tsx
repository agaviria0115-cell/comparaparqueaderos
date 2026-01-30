import type { Parking } from "../types";

interface ParkingCardProps {
  parking: Parking;
}

export function ParkingCard({ parking }: ParkingCardProps) {
  return (
    <article style={{ padding: "12px 0", borderBottom: "1px solid #eee" }}>
      <h3 style={{ marginBottom: 4 }}>{parking.name}</h3>

      {parking.distanceMeters > 0 && (
        <p style={{ fontSize: 14, color: "#666", marginBottom: 6 }}>
          Distance: {parking.distanceMeters} m
        </p>
      )}

      <div style={{ marginBottom: 8 }}>
        <strong style={{ fontSize: 20 }}>
          ${parking.totalPrice.toLocaleString()}
        </strong>
      </div>

      {parking.tags.length > 0 && (
        <p style={{ fontSize: 14, color: "#444", marginBottom: 8 }}>
          {parking.tags.join(" • ")}
        </p>
      )}

      <button>View details</button>
    </article>
  );
}