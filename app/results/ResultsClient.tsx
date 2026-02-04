"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import Link from "next/link";

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */

/**
 * Calculates the total number of parking days.
 * Always returns at least 1 day.
 */
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

/**
 * Formats a date to a user-friendly format.
 * Example: 02-Feb-2026
 */
function formatDateFriendly(dateStr: string) {
  const date = new Date(dateStr);

  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

/**
 * Formats a number using Colombian currency format (COP).
 * Example: 84000 -> 84.000
 */
function formatCOP(value: number) {
  return value.toLocaleString("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/* -------------------------------------------------------
   Main Component
------------------------------------------------------- */

export default function ResultsClient() {
  const searchParams = useSearchParams();

  /* -----------------------------
     Query Params
  ----------------------------- */

  const city_id = searchParams.get("city_id");
  const airport_id = searchParams.get("airport_id");
  const vehiculo = searchParams.get("vehiculo");

  const fechaEntrada = searchParams.get("fechaEntrada");
  const horaEntrada = searchParams.get("horaEntrada");
  const fechaSalida = searchParams.get("fechaSalida");
  const horaSalida = searchParams.get("horaSalida");

  /* -----------------------------
     State
  ----------------------------- */

  const [selectedParking, setSelectedParking] = useState<any>(null);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_surname: "",
    customer_phone: "",
    vehicle_plate: "",
  });

  const [cityName, setCityName] = useState<string | null>(null);
  const [airport, setAirport] =
    useState<{ name: string; code: string } | null>(null);

  const [parkings, setParkings] = useState<any[]>([]);
  const [loadingParkings, setLoadingParkings] = useState(true);

  const [sortBy, setSortBy] =
    useState<"price" | "price_desc" | "distance">("price");

  const [filterCovered, setFilterCovered] = useState(false);
  const [filterOpenAir, setFilterOpenAir] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [confirmationData, setConfirmationData] = useState<null | {
  parkingName: string;
  start: string;
  end: string;
  totalPrice: number;
  reference: string;
  whatsappUrl: string;
}>(null);


  /* -----------------------------
     Derived Values
  ----------------------------- */

  const totalDays = calculateTotalDays(
    fechaEntrada!,
    horaEntrada!,
    fechaSalida!,
    horaSalida!
  );

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

  /* -------------------------------------------------------
     Handlers
  ------------------------------------------------------- */

  /**
   * Triggered when user clicks "Reservar por WhatsApp"
   * Opens the modal and sets the selected parking.
   */
  function handleReservar(parking: any) {
    setSelectedParking(parking);
  }

  /**
   * Updates a single field in the booking form.
   */
  function updateField(field: string, value: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  /**
   * Creates the booking in Supabase and opens WhatsApp
   * with a pre-filled message to the operator.
   */
  async function createBooking() {
    if (!selectedParking) return;

    const totalDays = calculateTotalDays(
      fechaEntrada!,
      horaEntrada!,
      fechaSalida!,
      horaSalida!
    );

    const totalPrice = selectedParking.price_per_day * totalDays;

    const payload = {
      parking_id: selectedParking.id,
      operator_id: selectedParking.operator_id,
      customer_name: formData.customer_name,
      customer_surname: formData.customer_surname,
      customer_phone: formData.customer_phone,
      vehicle_plate: formData.vehicle_plate,
      vehicle: vehiculo === "carro" ? "Carro" : "Moto",
      start_date: fechaEntrada,
      entry_time: horaEntrada,
      end_date: fechaSalida,
      exit_time: horaSalida,
      price_per_day: selectedParking.price_per_day,
      total_days: totalDays,
      total_price: totalPrice,
      status: "initiated",
    };

    const { data, error } = await supabase
      .from("bookings")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Booking insert failed:", error);
      alert("No pudimos iniciar la reserva. Intenta nuevamente.");
      return;
    }

    /* -----------------------------
       WhatsApp Message
    ----------------------------- */

    const coveredLabel = selectedParking.is_covered
      ? "Bajo Techo"
      : "Aire Libre";

    // Short, user-friendly reference
    const shortReference = "CP-" + data.id.slice(-6).toUpperCase();

    const whatsappMessage = `
Hola

Quiero reservar un parqueadero en *${selectedParking.name}*,
con los siguientes datos:

• *Tipo de parqueadero:* ${coveredLabel}
• *Entrada:* ${formatDateFriendly(fechaEntrada!)} - ${horaEntrada}
• *Salida:* ${formatDateFriendly(fechaSalida!)} - ${horaSalida}
• *Precio por día:* $${formatCOP(selectedParking.price_per_day)}
• *Total:* $${formatCOP(data.total_price)}

• *Nombre:* ${formData.customer_name} ${formData.customer_surname}
• *Vehículo:* ${vehiculo === "carro" ? "Carro" : "Moto"}
• *Placa:* ${formData.vehicle_plate}
• *Referencia:* ${shortReference}

Enviado desde *ComparaParqueaderos.com*
`.trim();

    const encodedMessage = encodeURIComponent(whatsappMessage);

    const whatsappNumber =
      selectedParking.operators.whatsapp_number.replace(/\D/g, "");

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");

    setConfirmationData({
    parkingName: selectedParking.name,
    start: `${formatDateFriendly(fechaEntrada!)} ${horaEntrada}`,
    end: `${formatDateFriendly(fechaSalida!)} ${horaSalida}`,
    totalPrice: data.total_price,
    reference: shortReference,
    whatsappUrl,
    });

    setSelectedParking(null);
    setShowConfirmation(true);
  }

  /* -------------------------------------------------------
     Data Loading
  ------------------------------------------------------- */

  // Load city name
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
          operator_id,
          name,
          slug,
          distance_km,
          price_per_day,
          currency,
          is_covered,
          has_shuttle,
          airport:airports (
            slug
          ),
          operators (
            whatsapp_number
          )
        `)
        .eq("airport_id", airport_id)
        .eq("is_active", true)
        .eq("vehicle", vehicleValue);

      setParkings(data || []);
      setLoadingParkings(false);
    }

    loadParkings();
  }, [airport_id, vehiculo]);

  // Restore saved form data from sessionStorage
  useEffect(() => {
    if (!selectedParking) return;

    const saved = sessionStorage.getItem("bookingUserData");
    if (!saved) return;

    try {
      setFormData(JSON.parse(saved));
    } catch {
      // Ignore invalid session data
    }
  }, [selectedParking]);

  /* -------------------------------------------------------
     Render
  ------------------------------------------------------- */

  return (
    <section className="max-w-5xl mx-auto px-5 sm:px-6 py-6 space-y-6">
        {showConfirmation ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">
            Reserva iniciada
        </h2>

        <p className="text-sm text-gray-700">
            Tu solicitud fue enviada correctamente al operador del parqueadero.
            El operador continuará la reserva directamente contigo por WhatsApp.
        </p>

        {confirmationData && (
            <div className="bg-white border rounded p-4 text-sm space-y-1">
            <div>
                <strong>Parqueadero:</strong> {confirmationData.parkingName}
            </div>
            <div>
                <strong>Entrada:</strong> {confirmationData.start}
            </div>
            <div>
                <strong>Salida:</strong> {confirmationData.end}
            </div>
            <div>
                <strong>Total:</strong> ${formatCOP(confirmationData.totalPrice)}
            </div>
            <div>
                <strong>Referencia:</strong> {confirmationData.reference}
            </div>
            </div>
        )}

        <div className="flex flex-col gap-2 pt-2">
            <button
            onClick={() => {
                if (confirmationData?.whatsappUrl) {
                window.open(confirmationData.whatsappUrl, "_blank");
                }
            }}
            className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700"
            >
            Volver a abrir WhatsApp
            </button>

            <button
            onClick={() => setShowConfirmation(false)}
            className="text-sm text-blue-600 underline"
            >
            Volver a resultados
            </button>
        </div>

        <p className="text-xs text-gray-500 pt-2">
            ComparaParqueaderos.com no procesa pagos ni confirma reservas.
            La disponibilidad depende del operador.
        </p>
        </div>

        ) : (
        <>

        <nav className="text-sm text-gray-600">
          <Link href="/">Inicio</Link>

          {airport && (
            <>
              {" "} /{" "}
              <Link href={`/aeropuerto/${airport_id}`}>
                {airport.name}
              </Link>
            </>
          )}
        </nav>

      {/* Header */}
      <h1 className="text-2xl font-bold">
        Parqueaderos disponibles cerca del aeropuerto{" "}
        {airport ? `${airport.name} (${airport.code})` : "…"}
      </h1>

      {/* Airport */}
      <div className="text-sm text-gray-600">
        {airport ? (
          <>
            <strong>Aeropuerto:</strong> {airport.name} ({airport.code})
          </>
        ) : (
          "Cargando aeropuerto…"
        )}
      </div>

      {/* Search summary */}
      <div className="bg-gray-100 p-4 rounded text-sm space-y-1">
        <div><strong>Vehículo:</strong> {vehiculo}</div>
        <div><strong>Entrada:</strong> {fechaEntrada} {horaEntrada}</div>
        <div><strong>Salida:</strong> {fechaSalida} {horaSalida}</div>
      </div>

      {/* Sorting */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-600">Ordenar por</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="border rounded px-2 py-1"
        >
          <option value="price">Menor precio</option>
          <option value="price_desc">Mayor precio</option>
          <option value="distance">Menor distancia</option>
        </select>
      </div>

      {/* Filters */}
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

      {/* Parking cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadingParkings && <div>Cargando parqueaderos…</div>}

        {!loadingParkings &&
          sortedParkings.map((p) => {
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

                <div className="text-right flex flex-col items-end gap-2">
                  <div className="text-2xl font-bold">
                    $ {totalPrice.toLocaleString()}
                  </div>

                  <Link
                    href={`/aeropuerto/${p.airport.slug}/parqueadero/${p.slug}`}
                    className="inline-block bg-blue-600 text-white text-sm px-3 py-2 rounded"
                  >
                    Ver detalles
                  </Link>

                  <button
                    onClick={() => handleReservar(p)}
                    className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700"
                  >
                    Reservar por WhatsApp
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {/* Booking Modal */}
      {selectedParking && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold">Completa tus datos</h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre"
                value={formData.customer_name}
                onChange={(e) => updateField("customer_name", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />

              <input
                type="text"
                placeholder="Apellido"
                value={formData.customer_surname}
                onChange={(e) => updateField("customer_surname", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />

              <input
                type="tel"
                placeholder="WhatsApp"
                value={formData.customer_phone}
                onChange={(e) => updateField("customer_phone", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />

              <input
                type="text"
                placeholder="Placa del vehículo"
                value={formData.vehicle_plate}
                onChange={(e) => updateField("vehicle_plate", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setSelectedParking(null)}
                className="text-sm px-4 py-2 border rounded"
              >
                Cancelar
              </button>

              <button
                onClick={async () => {
                  sessionStorage.setItem(
                    "bookingUserData",
                    JSON.stringify(formData)
                  );
                  await createBooking();
                }}
                className="bg-green-600 text-white text-sm px-4 py-2 rounded"
              >
                Continuar a WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </>
    )}
    </section>
    );
}
