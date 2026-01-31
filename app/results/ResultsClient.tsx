"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

function calculateTotalDays(
  fechaEntrada: string,
  horaEntrada: string,
  fechaSalida: string,
  horaSalida: string
) {
  const start = new Date(`${fechaEntrada}T${horaEntrada}`);
  const end = new Date(`${fechaSalida}T${horaSalida}`);

  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return Math.max(1, diffDays);
}

export default function ResultsClient() {
  const searchParams = useSearchParams();

  const city_id = searchParams.get("city_id");
  const airport_id = searchParams.get("airport_id");
  const vehiculo = searchParams.get("vehiculo");
  const fechaEntrada = searchParams.get("fechaEntrada");
  const horaEntrada = searchParams.get("horaEntrada");
  const fechaSalida = searchParams.get("fechaSalida");
  const horaSalida = searchParams.get("horaSalida");

  const totalDays = calculateTotalDays(
    fechaEntrada!,
    horaEntrada!,
    fechaSalida!,
    horaSalida!
  );

  const [cityName, setCityName] = useState<string | null>(null);
  const [airport, setAirport] =
    useState<{ name: string; code: string } | null>(null);

  const [parkings, setParkings] = useState<any[]>([]);
  const [sortBy, setSortBy] =
    useState<"price" | "price_desc" | "distance">("price");
  const [loadingParkings, setLoadingParkings] = useState(true);
  const [filterCovered, setFilterCovered] = useState(false);
  const [filterOpenAir, setFilterOpenAir] = useState(false);

  const filteredParkings = parkings.filter((p) => {
    if (filterCovered && !filterOpenAir) return p.is_covered;
    if (filterOpenAir && !filterCovered) return !p.is_covered;
    return true;
  });

  const sortedParkings = [...filteredParkings].sort((a, b) => {
    if (sortBy === "price") return a.price_per_day - b.price_per_day;
    if (sortBy === "price_desc") return b.price_per_day - a.price_per_day;
    if (sortBy === "distance") return a.distance_km - b.distance_km;
    return 0;
  });

  // Load city
  useEffect(() => {
    if (!city_id) return;

    async function loadCity() {
      const { data } = await supabase
        .from("cities")
        .select("name")
        .eq("id", city_id)
        .single();

      if (data) setCityName(data.name);
    }

    loadCity();
  }, [city_id]);

  // Load airport
  useEffect(() => {
    if (!airport_id) return;

    async function loadAirport() {
      const { data } = await supabase
        .from("airports")
        .select("name, code")
        .eq("id", airport_id)
        .single();

      if (data) setAirport(data);
    }

    loadAirport();
  }, [airport_id]);

  // Load parkings
  useEffect(() => {
    if (!airport_id || !vehiculo) return;

    async function loadParkings() {
      setLoadingParkings(true);

      const vehicleValue = vehiculo === "carro" ? "Carro" : "Moto";

      const { data } = await supabase
        .from("parkings")
        .select(`
          id,
          name,
          distance_km,
          price_per_day,
          currency,
          is_covered,
          has_shuttle
        `)
        .eq("airport_id", airport_id)
        .eq("is_active", true)
        .eq("vehicle", vehicleValue);

      setParkings(data || []);
      setLoadingParkings(false);
    }

    loadParkings();
  }, [airport_id, vehiculo]);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Parqueaderos en {cityName ?? "…"}
      </h1>

      <div className="text-sm text-gray-600">
        {airport ? (
          <>
            <strong>Aeropuerto:</strong> {airport.name} ({airport.code})
          </>
        ) : (
          "Cargando aeropuerto…"
        )}
      </div>

      <div className="bg-gray-100 p-4 rounded text-sm space-y-1">
        <div><strong>Vehículo:</strong> {vehiculo}</div>
        <div><strong>Entrada:</strong> {fechaEntrada} {horaEntrada}</div>
        <div><strong>Salida:</strong> {fechaSalida} {horaSalida}</div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-600">Ordenar por</span>
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as any)
            }
            className="border rounded px-2 py-1"
          >
            <option value="price">Menor precio</option>
            <option value="price_desc">Mayor precio</option>
            <option value="distance">Menor distancia</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={filterCovered}
            onChange={(e) => setFilterCovered(e.target.checked)}
          />
          Bajo Techo
        </label>

        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={filterOpenAir}
            onChange={(e) => setFilterOpenAir(e.target.checked)}
          />
          Aire Libre
        </label>
      </div>

      <div className="space-y-4">
        {loadingParkings && <div>Cargando parqueaderos…</div>}

        {!loadingParkings && sortedParkings.map((p) => {
          const totalPrice = p.price_per_day * totalDays;

          return (
            <div
              key={p.id}
              className="border rounded-lg p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
            >
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-gray-600">{p.distance_km} km</div>
                <div className="text-sm text-gray-600">
                  {p.is_covered ? "Bajo Techo" : "Aire Libre"}
                  {p.has_shuttle && " • Shuttle"}
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold">
                  $ {totalPrice.toLocaleString()}
                </div>
                <button className="text-sm underline mt-1">
                  Ver detalles
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
