import type { Parking } from "../types";

interface ParkingCardProps {
  parking: Parking;
}

export function ParkingCard({ parking }: ParkingCardProps) {
  return (
    <article
      style={{
        padding: "16px",
        border: "1px solid #eee",
        borderRadius: 8,
        marginBottom: 12,
        background: "#fff",
      }}
    >
      {/* Name */}
      <h3 style={{ marginBottom: 6 }}>
        {parking.name}
      </h3>

      {/* Price */}
      <div style={{ marginBottom: 8 }}>
        <strong style={{ fontSize: 22 }}>
          ${parking.totalPrice.toLocaleString()}
        </strong>
      </div>

      {/* Tags */}
      {parking.tags.length > 0 && (
        <p
          style={{
            fontSize: 14,
            color: "#555",
            marginBottom: 12,
          }}
        >
          {parking.tags.join(" • ")}
        </p>
      )}

      {/* Action */}
      <button
        style={{
          padding: "8px 12px",
          borderRadius: 6,
          border: "1px solid #ccc",
          background: "#f8f8f8",
          cursor: "pointer",
        }}
      >
        Ver detalles
      </button>
    </article>
  );
}