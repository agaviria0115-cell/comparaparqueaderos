"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/app/lib/supabase";

export default function SearchForm() {
  const [cities, setCities] = useState<any[]>([]);
  const [airports, setAirports] = useState<any[]>([]);
  const horaSalidaRef = useRef<HTMLInputElement>(null);
  const horaEntradaRef = useRef<HTMLInputElement>(null);
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    city_id: "",
    airport_id: "",
    vehiculo: "",
    fechaEntrada: "",
    horaEntrada: "",
    fechaSalida: "",
    horaSalida: "",
  });

// Load cities ONCE on page load
useEffect(() => {
  async function loadCities() {
    const { data, error } = await supabase
      .from("cities")
      .select("id, name");

    if (error) {
      console.error("Error loading cities:", error);
    } else {
      setCities(data || []);
      console.log("CITIES LOADED:", data);
    }
  }

  loadCities();
}, []);

// Load airports WHEN city changes
useEffect(() => {
  if (!form.city_id) {
    setAirports([]);
    return;
  }

  async function loadAirports() {
    const { data, error } = await supabase
      .from("airports")
      .select("id, name, code")
      .eq("city_id", form.city_id);

    if (error) {
      console.error("Error loading airports:", error);
    } else {
      setAirports(data || []);
      console.log("AIRPORTS LOADED:", data);
    }
  }

  loadAirports();
}, [form.city_id]);

function handleChange(
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) {
  const { name, value } = e.target;

  // Clear exit-time validation when user edits exit fields
if (
  (name === "fechaSalida" || name === "horaSalida") &&
  horaSalidaRef.current
) {
  horaSalidaRef.current.setCustomValidity("");
}

if (
  (name === "fechaEntrada" || name === "horaEntrada") &&
  horaEntradaRef.current
) {
  horaEntradaRef.current.setCustomValidity("");
}

  setForm({ ...form, [name]: value });
}

function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

// Always clear previous custom validity first
if (horaSalidaRef.current) {
  horaSalidaRef.current.setCustomValidity("");
}

// Build comparable timestamps (local time, no Date parsing quirks)
function buildLocalTimestamp(fecha: string, hora: string) {
  const [year, month, day] = fecha.split("-").map(Number);
  const [hour, minute] = hora.split(":").map(Number);

  // month - 1 because JS months are 0-based
  return new Date(year, month - 1, day, hour, minute).getTime();
}

const entradaTimestamp = buildLocalTimestamp(
  form.fechaEntrada,
  form.horaEntrada
);

const salidaTimestamp = buildLocalTimestamp(
  form.fechaSalida,
  form.horaSalida
);

const now = new Date();
const todayStr = now.toISOString().split("T")[0];

// If entrada date is today, block past entry times
if (form.fechaEntrada === todayStr && horaEntradaRef.current) {
  const [h, m] = form.horaEntrada.split(":").map(Number);
  const entradaTime = new Date();
  entradaTime.setHours(h, m, 0, 0);

  if (entradaTime < now) {
    horaEntradaRef.current.setCustomValidity(
      "La hora de entrada no puede ser en el pasado"
    );
    horaEntradaRef.current.reportValidity();
    return;
  }
}

// If salida date is today, block past exit times
if (form.fechaSalida === todayStr && horaSalidaRef.current) {
  const [h, m] = form.horaSalida.split(":").map(Number);
  const salidaTime = new Date();
  salidaTime.setHours(h, m, 0, 0);

  if (salidaTime < now) {
    horaSalidaRef.current.setCustomValidity(
      "La hora de salida no puede ser en el pasado"
    );
    horaSalidaRef.current.reportValidity();
    return;
  }
}

// Validate logical order
if (salidaTimestamp <= entradaTimestamp) {
  if (horaSalidaRef.current) {
    horaSalidaRef.current.setCustomValidity(
      "La fecha y hora de salida debe ser posterior a la entrada"
    );
    horaSalidaRef.current.reportValidity();
  }
  return;
}

  // Clear custom validity if everything is OK
if (horaEntradaRef.current) {
  horaEntradaRef.current.setCustomValidity("");
}
if (horaSalidaRef.current) {
  horaSalidaRef.current.setCustomValidity("");
}

  const query = new URLSearchParams(form).toString();
  window.location.href = `/results?${query}`;
}

  const labelStyle = {
  fontSize: "14px",
  fontWeight: 500,
  marginBottom: "4px",
  display: "block",
  };

  return (
    <section className="px-6 pb-20">
      <form
        onSubmit={handleSubmit}
        className="
          grid grid-cols-1 gap-3
          md:grid-cols-7 md:gap-2
          max-w-6xl mx-auto
          bg-gray-50 p-4 rounded-xl shadow
        "
      >
        {/* Ciudad (required) */}
        <div>
          <label style={labelStyle}>Ciudad</label>
          <select
            name="city_id"
            value={form.city_id}
            required
            onChange={(e) => {
              setForm({
                ...form,
                city_id: e.target.value,
                airport_id: "",
              });
            }}
          >
            <option value="">Selecciona ciudad</option>

            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Aeropuerto (required SELECT) */}
        <div>
          <label style={labelStyle}>Aeropuerto</label>
          <select
            name="airport_id"
            value={form.airport_id}
            required
            onChange={handleChange}
            disabled={!form.city_id}
          >
            <option value="">
              {form.city_id
                ? "Selecciona aeropuerto"
                : "Selecciona ciudad primero"}
            </option>

            {airports.map((airport) => (
              <option key={airport.id} value={airport.id}>
                {airport.name} ({airport.code})
              </option>
            ))}
          </select>
        </div>

        {/* Vehículo (required SELECT) */}
        <div>
          <label style={labelStyle}>Vehículo</label>
          <select
            name="vehiculo"
            value={form.vehiculo}
            required
            onChange={handleChange}
          >
            <option value="">Selecciona vehículo</option>
            <option value="carro">Carro</option>
            <option value="moto">Moto</option>
          </select>
        </div>

        {/* Fecha Entrada */}
        <div>
        <label style={labelStyle}>Fecha de entrada</label>
        <input type="date" name="fechaEntrada" required min={today} onChange={handleChange} />
        </div>

        {/* Hora Entrada */}
        <div>
        <label style={labelStyle}>Hora de entrada</label>
        <input type="time" name="horaEntrada" required ref={horaEntradaRef} onChange={handleChange} />
        </div>

        {/* Fecha Salida */}
        <div>
        <label style={labelStyle}>Fecha de salida</label>
        <input type="date" name="fechaSalida" required min={today} onChange={handleChange} />
        </div>

        {/* Hora Salida */}
        <div>
        <label style={labelStyle}>Hora de salida</label>
        <input type="time" name="horaSalida" required ref={horaSalidaRef} onChange={handleChange} />
        </div>

        {/* Submit */}
      <button
        type="submit"
        className="
          md:col-span-7
          bg-black text-white py-3 rounded-lg font-semibold
          hover:bg-gray-800 transition
        "
      >
        Buscar parqueadero
      </button>
      </form>
    </section>
  );
}
