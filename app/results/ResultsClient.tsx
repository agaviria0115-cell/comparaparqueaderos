"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */

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

function formatDateFriendly(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  const dd = String(date.getDate()).padStart(2, "0");
  const monthLabel = date.toLocaleString("en-US", { month: "short" });
  const yyyy = date.getFullYear();

  return `${dd}-${monthLabel}-${yyyy}`;
}

function formatDistance(distanceKm: number | null) {
  if (!distanceKm || distanceKm <= 0) return null;

  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }

  return `${Number(distanceKm.toFixed(1))} km`;
}

/* -------------------------------------------------------
   Offer features mapping
------------------------------------------------------- */

const OFFER_FEATURE_MAP: Record<string, { label: string; icon: string }> = {
  "estacion de carga electrica": { label: "Estación de carga eléctrica", icon: "⚡" },
  "carga electrica": { label: "Estación de carga eléctrica", icon: "⚡" },
  "lavado incluido": { label: "Lavado incluido", icon: "🧼" },
  "lavado disponible": { label: "Lavado disponible", icon: "🧼" },
  "lavado con costo adicional": { label: "Lavado disponible", icon: "🧼" },
  "servicio valet": { label: "Servicio valet", icon: "🚗" },
  "valet": { label: "Servicio valet", icon: "🚗" },
  "guarda cascos": { label: "Guarda cascos", icon: "🪖" },
  "locker para cascos": { label: "Guarda cascos", icon: "🪖" },
  "casillero para cascos": { label: "Guarda cascos", icon: "🪖" }
};

function normalizeFeature(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

function extractOfferFeatures(raw: string | null) {
  if (!raw) return [] as { label: string; icon: string }[];

  return raw
    .split(",")
    .map((f) => normalizeFeature(f))
    .map((key) => OFFER_FEATURE_MAP[key])
    .filter(Boolean)
    .slice(0, 2);
}

/* -------------------------------------------------------
   Component
------------------------------------------------------- */

export default function ResultsClient() {
  const searchParams = useSearchParams();

  const city_id = searchParams.get("city_id");
  const airport_id = searchParams.get("airport_id");
  const vehiculo = searchParams.get("vehiculo");

  const fechaEntrada = searchParams.get("fechaEntrada");
  const horaEntrada = searchParams.get("horaEntrada");
  const fechaSalida = searchParams.get("fechaSalida");
  const horaSalida = searchParams.get("horaSalida");

  const [city, setCity] = useState<{ name: string; slug: string } | null>(null);
  const [airport, setAirport] = useState<{
    name: string;
    code: string;
    slug: string;
  } | null>(null);

  const [parkings, setParkings] = useState<any[]>([]);
  const [loadingParkings, setLoadingParkings] = useState(true);

  const [sortBy, setSortBy] = useState<"price" | "price_desc" | "distance">("price");
  const [filterCovered, setFilterCovered] = useState(false);
  const [filterOpenAir, setFilterOpenAir] = useState(false);

  const totalDays =
    fechaEntrada && horaEntrada && fechaSalida && horaSalida
      ? calculateTotalDays(fechaEntrada, horaEntrada, fechaSalida, horaSalida)
      : 1;

  useEffect(() => {
    if (!city_id) return;

    supabase
      .from("cities")
      .select("name, slug")
      .eq("id", city_id)
      .single()
      .then(({ data }) => data && setCity(data));
  }, [city_id]);

  useEffect(() => {
    if (!airport_id) return;

    supabase
      .from("airports")
      .select("name, code, slug")
      .eq("id", airport_id)
      .single()
      .then(({ data }) => data && setAirport(data));
  }, [airport_id]);

  useEffect(() => {
    if (!airport_id || !vehiculo) return;

    const vehicleValue = vehiculo === "carro" ? "Carro" : "Moto";

    setLoadingParkings(true);

    supabase
      .from("parkings")
      .select(`
        id,
        name,
        slug,
        price_per_day,
        is_covered,
        logo_url,
        services,
        offer_features,
        distance_km,
        parking_location:parking_locations!inner (
          id,
          slug,
          airport:airports ( slug )
        )
      `)
      .eq("airport_id", airport_id)
      .eq("is_active", true)
      .eq("vehicle", vehicleValue)
      .then(({ data }) => {
        setParkings(data || []);
        setLoadingParkings(false);
      });
  }, [airport_id, vehiculo]);

  const filteredParkings = parkings.filter((p) => {
    if (filterCovered && !filterOpenAir) return p.is_covered;
    if (filterOpenAir && !filterCovered) return !p.is_covered;
    return true;
  });

  const sortedParkings = [...filteredParkings].sort((a, b) => {
    if (sortBy === "price") return a.price_per_day - b.price_per_day;
    if (sortBy === "price_desc") return b.price_per_day - a.price_per_day;
    if (sortBy === "distance") {
      if (a.distance_km == null) return 1;
      if (b.distance_km == null) return -1;
      return a.distance_km - b.distance_km;
    }
    return 0;
  });

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <nav className="text-sm text-gray-600">
        <Link href="/">Inicio</Link>
        {city && <> / <Link href={`/ciudad/${city.slug}`}>{city.name}</Link></>}
        {airport && <> / <Link href={`/aeropuerto/${airport.slug}`}>Aeropuerto {airport.name}</Link></>}
      </nav>

      <PageHeader
        title={
          airport
            ? `Parqueaderos cerca del Aeropuerto ${airport.name} (${airport.code})`
            : "Parqueaderos disponibles"
        }
        subtitle={
          vehiculo && fechaEntrada && fechaSalida
            ? `${vehiculo} • ${formatDateFriendly(fechaEntrada)} ${horaEntrada} → ${formatDateFriendly(fechaSalida)} ${horaSalida}`
            : undefined
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-600">Ordenar por</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border rounded px-2 py-1"
          >
            <option value="price">Menor precio</option>
            <option value="price_desc">Mayor precio</option>
            <option value="distance">Distancia</option>
          </select>
        </div>

        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={filterCovered} onChange={(e) => setFilterCovered(e.target.checked)} />
            Cubierto
          </label>

          <label className="flex items-center gap-1">
            <input type="checkbox" checked={filterOpenAir} onChange={(e) => setFilterOpenAir(e.target.checked)} />
            Aire Libre
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loadingParkings && (
          <div className="col-span-full text-center text-sm text-gray-500 py-12">
            Cargando parqueaderos…
          </div>
        )}

        {!loadingParkings &&
          sortedParkings.map((p) => {
            const totalPrice = p.price_per_day * totalDays;
            const offerFeatures = extractOfferFeatures(p.offer_features);

            return (
              <div
                key={p.id}
                className="rounded-lg border border-black bg-white overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="bg-blue-50 border-b border-blue-100 px-4 py-3 text-center">
                  <div className="font-semibold text-base">{p.name}</div>
                  <div className="text-base text-gray-600">
                    {p.is_covered ? "Cubierto" : "Aire Libre"}
                  </div>
                </div>

                <div className="h-44 w-full px-2 pt-2">
                  <div className="h-full w-full bg-white rounded-md">
                    <div className="h-full px-4 flex items-center justify-center text-sm text-gray-500">
                      {p.logo_url ? (
                        <img src={p.logo_url} alt={`Logo ${p.name}`} className="max-h-32 max-w-full object-contain" />
                      ) : (
                        <span>LOGO</span>
                      )}
                    </div>
                  </div>
                </div>

                {formatDistance(p.distance_km) && (
                  <div className="px-5 pt-3 text-base text-gray-700 flex items-center gap-2">
                    <span className="text-gray-500">📍</span>
                    <span>
                      <strong>{formatDistance(p.distance_km)}</strong> del aeropuerto
                    </span>
                  </div>
                )}

                <div className="px-5 py-5 flex flex-col gap-3 flex-1">
                  {(p.services || offerFeatures.length > 0) && (
                    <ul className="space-y-1 text-[13px] text-gray-700">
                      {p.services &&
                        p.services
                          .split(",")
                          .map((s: string) => s.trim())
                          .filter(Boolean)
                          .slice(0, 4)
                          .map((service: string) => (
                            <li key={service} className="flex items-center gap-2">
                              <span className="w-4 text-center text-blue-600 font-semibold">✓</span>
                              <span>{service}</span>
                            </li>
                          ))}

                      {offerFeatures.map((feat) => (
                        <li key={feat.label} className="flex items-center gap-2">
                          <span className="w-4 text-center text-[13px] leading-none">{feat.icon}</span>
                          <span className="font-medium">{feat.label}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="border-t border-gray-200 pt-4 mt-auto -mx-5 px-5 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-700">
                        $ {totalPrice.toLocaleString("es-CO", { maximumFractionDigits: 0 })}
                      </div>
                      <div className="text-xs text-gray-500">
                        Total por {totalDays} {totalDays === 1 ? "día" : "días"}
                      </div>
                    </div>

                    {(() => {
                      const params = new URLSearchParams({
                        vehiculo: vehiculo || "",
                        tipo: p.is_covered ? "cubierto" : "aire-libre",
                        fechaEntrada: fechaEntrada || "",
                        horaEntrada: horaEntrada || "",
                        fechaSalida: fechaSalida || "",
                        horaSalida: horaSalida || "",
                        total: totalPrice.toString(),
                        totalDays: totalDays.toString(),
                        offerId: p.id
                      });

                      const url = `/aeropuerto/${p.parking_location.airport.slug}/parqueadero/${p.parking_location.slug}?${params.toString()}`;

                      return (
                        <Link
                          href={url}
                          className="inline-flex items-center justify-center rounded-md bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 transition"
                        >
                          Ver detalles
                        </Link>
                      );
                    })()}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}
