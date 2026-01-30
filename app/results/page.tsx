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


export default function ResultsPage() {
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
  const [airport, setAirport] = useState<{ name: string; code: string } | null>(null);

  const [parkings, setParkings] = useState<any[]>([]);
  const [loadingParkings, setLoadingParkings] = useState(true);

  // Load city name
  useEffect(() => {
    if (!city_id) return;

    async function loadCity() {
      const { data, error } = await supabase
        .from("cities")
        .select("name")
        .eq("id", city_id)
        .single();

      if (!error) {
        setCityName(data.name);
      }
    }

    loadCity();
  }, [city_id]);

  // Load airport name + code
  useEffect(() => {
    if (!airport_id) return;

    async function loadAirport() {
      const { data, error } = await supabase
        .from("airports")
        .select("name, code")
        .eq("id", airport_id)
        .single();

      if (!error) {
        setAirport(data);
      }
    }

    loadAirport();
  }, [airport_id]);

  // Fetch parkings
useEffect(() => {
  if (!airport_id || !vehiculo) return;

  async function loadParkings() {
    setLoadingParkings(true);

const vehicleValue =
  vehiculo === "carro" ? "Carro" : "Moto";

const { data, error } = await supabase
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

    if (error) {
      console.error("Error loading parkings:", error);
      setParkings([]);
    } else {
      setParkings(data || []);
    }

    setLoadingParkings(false);
  }

  loadParkings();
}, [airport_id, vehiculo]);

  return (
    <section className="max-w-5xl mx-auto p-6 space-y-6">
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
        <div>
          <strong>Entrada:</strong> {fechaEntrada} {horaEntrada}
        </div>
        <div>
          <strong>Salida:</strong> {fechaSalida} {horaSalida}
        </div>
      </div>

<div className="space-y-4">
  {loadingParkings && (
    <div className="text-gray-500">Cargando parqueaderos…</div>
  )}

  {!loadingParkings && parkings.length === 0 && (
    <div className="text-gray-500">
      No hay parqueaderos disponibles para esta búsqueda.
    </div>
  )}

{!loadingParkings &&
  parkings.map((p) => {
    const totalPrice = p.price_per_day * totalDays;

    return (
      <div
        key={p.id}
        className="border rounded p-4 flex justify-between items-center"
      >
        <div>
          <div className="font-semibold">{p.name}</div>

          <div className="text-sm text-gray-600 mt-1">
            {p.distance_km} km del aeropuerto
          </div>

          <div className="text-sm text-gray-600 mt-1">
            {p.is_covered ? "Bajo Techo" : "Aire Libre"}
            {p.has_shuttle && " • Shuttle"}
          </div>
        </div>

        <div className="text-right">
          <div className="text-xl font-semibold">
            $ {totalPrice.toLocaleString()}
          </div>

          <button className="text-sm font-medium underline mt-2">
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
