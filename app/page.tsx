import { supabase } from "./lib/supabase";

export default async function Home() {
  const { data: parkings, error } = await supabase
    .from("parkings")
    .select("*")
    .eq("is_active", true)
    .order("price_per_day", { ascending: true });

  if (error) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Error loading parkings</h1>
        <pre>{error.message}</pre>
      </main>
    );
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Comparaparqueaderos</h1>

      {(!parkings || parkings.length === 0) && (
        <p>No parking options found.</p>
      )}

      <ul>
        {parkings?.map((parking) => (
          <li key={parking.id} style={{ marginBottom: 12 }}>
            <strong>{parking.name}</strong> —{" "}
            {parking.price_per_day} {parking.currency}
          </li>
        ))}
      </ul>
    </main>
  );
}