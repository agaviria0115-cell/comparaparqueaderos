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

function getCurrentTimeHHMM() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
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
  const timeOptions = generateTimeOptions(15);

  const [form, setForm] = useState({
    city_id: "",
    airport_id: "",
    vehiculo: "",
    fechaEntrada: "",
    horaEntrada: "12:00",
    fechaSalida: "",
    horaSalida: "12:00",
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

      if (form.horaEntrada < nowTime) {
        setForm((prev) => ({
          ...prev,
          horaEntrada: nowTime,
        }));
      }
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
    "mb-1 block text-xs font-medium text-gray-700";

  const inputClass =
    "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm " +
    "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none";

  const selectClass =
    "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm " +
    "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none " +
    "disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed";

  /* -----------------------------
     Render
  ----------------------------- */
  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-3"
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
        <div className="flex gap-2">
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
        <div className="flex gap-2">
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
          type="submit"
          className="
            w-full rounded-lg
            bg-yellow-400 py-3
            text-sm font-semibold text-gray-900
            hover:bg-yellow-300
            focus:outline-none focus:ring-2 focus:ring-yellow-400/50
            transition
          "
        >
          Buscar parqueadero
        </button>
      </div>
    </form>
  );
}
