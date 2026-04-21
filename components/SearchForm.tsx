"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/app/lib/supabase";

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */
function generateTimeOptions(intervalMinutes = 15) {
  const times: string[] = [];

  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += intervalMinutes) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      times.push(`${hh}:${mm}`);
    }
  }

  return times;
}

function getCurrentTimeHHMM(intervalMinutes = 15) {
  const now = new Date();

  let hours = now.getHours();
  let minutes = now.getMinutes();

  const remainder = minutes % intervalMinutes;

  if (remainder !== 0) {
    minutes += intervalMinutes - remainder;
  }

  if (minutes === 60) {
    hours += 1;
    minutes = 0;
  }

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");

  return `${hh}:${mm}`;
}

/* -------------------------------------------------------
   Component
------------------------------------------------------- */
export default function SearchForm() {
  const [cities, setCities] = useState<any[]>([]);
  const [airports, setAirports] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const horaSalidaRef = useRef<HTMLSelectElement>(null);
  const horaEntradaRef = useRef<HTMLSelectElement>(null);

  const today = new Date().toISOString().split("T")[0];

  const tomorrow = new Date(Date.now() + 86400000)
    .toISOString()
    .split("T")[0];

  const timeOptions = generateTimeOptions(15);

  const nowRounded = getCurrentTimeHHMM();

  const [form, setForm] = useState({
    city_id: "",
    airport_id: "",
    vehiculo: "",
    fechaEntrada: today,
    horaEntrada: nowRounded,
    fechaSalida: tomorrow,
    horaSalida: nowRounded,
  });

  /* -----------------------------
     Load cities ONCE
  ----------------------------- */
  useEffect(() => {
    async function loadCities() {
      const { data } = await supabase
        .from("cities")
        .select("id, name");
      setCities(data || []);
    }
    loadCities();
  }, []);

  /* -----------------------------
     Load airports WHEN city changes
  ----------------------------- */
  useEffect(() => {
    if (!form.city_id) {
      setAirports([]);
      return;
    }

    async function loadAirports() {
      const { data } = await supabase
        .from("airports")
        .select("id, name, code")
        .eq("city_id", form.city_id);

      setAirports(data || []);
    }

    loadAirports();
  }, [form.city_id]);

  /* -----------------------------
     Auto-fix past time when date = today
  ----------------------------- */
useEffect(() => {
  if (!form.fechaEntrada) return;

  if (form.fechaEntrada === today) {
    const nowTime = getCurrentTimeHHMM();

    setForm((prev) => ({
      ...prev,
      horaEntrada: prev.horaEntrada < nowTime ? nowTime : prev.horaEntrada,
      horaSalida: prev.horaSalida < nowTime ? nowTime : prev.horaSalida,
    }));
  }
}, [form.fechaEntrada]);

  /* -----------------------------
     Handlers
  ----------------------------- */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setError(null);

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const {
      city_id,
      airport_id,
      vehiculo,
      fechaEntrada,
      horaEntrada,
      fechaSalida,
      horaSalida,
    } = form;

    /* Required fields (Spanish only) */
    if (!city_id) {
      setError("Selecciona una ciudad.");
      return;
    }
    if (!airport_id) {
      setError("Selecciona un aeropuerto.");
      return;
    }
    if (!vehiculo) {
      setError("Selecciona el tipo de vehículo.");
      return;
    }
    if (!fechaEntrada) {
      setError("Selecciona la fecha de entrada.");
      return;
    }
    if (!horaEntrada) {
      setError("Selecciona la hora de entrada.");
      return;
    }
    if (!fechaSalida) {
      setError("Selecciona la fecha de salida.");
      return;
    }
    if (!horaSalida) {
      setError("Selecciona la hora de salida.");
      return;
    }

    /* Date rules */
    if (fechaEntrada < today) {
      setError("La fecha de entrada no puede ser anterior a hoy.");
      return;
    }

    if (fechaSalida < fechaEntrada) {
      setError(
        "La fecha de salida debe ser igual o posterior a la fecha de entrada."
      );
      return;
    }

    /* Date + time validation */
    const entradaDateTime = new Date(`${fechaEntrada}T${horaEntrada}`);
    const salidaDateTime = new Date(`${fechaSalida}T${horaSalida}`);

    if (salidaDateTime <= entradaDateTime) {
      setError(
        "La fecha y hora de salida deben ser posteriores a la fecha y hora de entrada."
      );
      return;
    }

    /* Time rule for today */
    if (fechaEntrada === today) {
      const nowTime = getCurrentTimeHHMM();
      if (horaEntrada < nowTime) {
        setError(
          "La hora de entrada debe ser posterior a la hora actual."
        );
        return;
      }
    }

    const query = new URLSearchParams(form).toString();
    window.location.href = `/results?${query}`;
  }

  /* -----------------------------
     Shared styles
  ----------------------------- */
  const labelClass =
    "mb-2 block text-xs font-semibold text-gray-700";

  const inputClass =
    "w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm " +
    "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none";

  const selectClass =
    "w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm " +
    "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none " +
    "disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed";

  /* -----------------------------
     Render
  ----------------------------- */
  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-3 bg-white"
    >
      {/* Ciudad */}
      <div className="md:col-span-2">
        <label className={labelClass}>Ciudad</label>
        <select
          name="city_id"
          value={form.city_id}
          onChange={handleChange}
          className={selectClass}
        >
          <option value="">Selecciona ciudad</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* Aeropuerto */}
      <div className="md:col-span-3">
        <label className={labelClass}>Aeropuerto</label>
        <select
          name="airport_id"
          value={form.airport_id}
          onChange={handleChange}
          disabled={!form.city_id}
          className={selectClass}
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

      {/* Vehículo */}
      <div className="md:col-span-1">
        <label className={labelClass}>Vehículo</label>
        <select
          name="vehiculo"
          value={form.vehiculo}
          onChange={handleChange}
          className={selectClass}
        >
          <option value="">Tipo</option>
          <option value="carro">Carro</option>
          <option value="moto">Moto</option>
        </select>
      </div>

      {/* Entrada */}
      <div className="md:col-span-3">
        <label className={labelClass}>Entrada</label>
        <div className="flex items-center gap-2">
          <input
            type="date"
            name="fechaEntrada"
            min={today}
            value={form.fechaEntrada}
            onChange={handleChange}
            className={`${inputClass} flex-1`}
          />
          <select
            name="horaEntrada"
            value={form.horaEntrada}
            ref={horaEntradaRef}
            onChange={handleChange}
            className={`${selectClass} w-28`}
          >
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Salida */}
      <div className="md:col-span-3">
        <label className={labelClass}>Salida</label>
        <div className="flex items-center gap-2">
          <input
            type="date"
            name="fechaSalida"
            min={today}
            value={form.fechaSalida}
            onChange={handleChange}
            className={`${inputClass} flex-1`}
          />
          <select
            name="horaSalida"
            value={form.horaSalida}
            ref={horaSalidaRef}
            onChange={handleChange}
            className={`${selectClass} w-28`}
          >
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inline validation message */}
      {error && (
        <div className="md:col-span-12 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* CTA */}
      <div className="md:col-span-12">
        <button
          className="
            mt-4
            w-full rounded-lg
            bg-blue-600 py-3
            text-white font-semibold
            hover:bg-blue-700
            focus:outline-none focus:ring-2 focus:ring-blue-600/40
            transition
            flex items-center justify-center gap-2
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m1.85-5.4a7.25 7.25 0 11-14.5 0 7.25 7.25 0 0114.5 0z"
            />
          </svg>
          Buscar parqueadero
        </button>
      </div>
    </form>
  );
}
