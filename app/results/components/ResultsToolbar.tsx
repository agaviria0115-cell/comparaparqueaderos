interface ResultsToolbarProps {
  sortBy: "cheapest" | "closest" | "best";
  onChange: (value: "cheapest" | "closest" | "best") => void;
}

export function ResultsToolbar({ sortBy, onChange }: ResultsToolbarProps) {
  return (
    <section style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 14, color: "#444" }}>
        Ordenar por{" "}
        <select
          value={sortBy}
          onChange={(e) =>
            onChange(e.target.value as "cheapest" | "closest" | "best")
          }
          style={{
            marginLeft: 6,
            padding: "4px 6px",
          }}
        >
          <option value="cheapest">Menor Precio</option>
          <option value="closest">Más cercano</option>
          <option value="best">Mejor opción</option>
        </select>
      </label>
    </section>
  );
}
