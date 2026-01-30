"use client";

import { useState } from "react";

export default function SearchForm() {
  const [form, setForm] = useState({
    ciudad: "",
    aeropuerto: "",
    fechaEntrada: "",
    horaEntrada: "",
    fechaSalida: "",
    horaSalida: "",
    codigo: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit() {
    if (!form.ciudad || !form.aeropuerto) {
      alert("Ciudad y Aeropuerto son obligatorios");
      return;
    }

    const query = new URLSearchParams(form).toString();
    window.location.href = `/search?${query}`;
  }

  return (
    <section className="px-6 pb-20">
      <div
        className="
          grid grid-cols-1 gap-3
          md:grid-cols-7 md:gap-2
          max-w-6xl mx-auto
          bg-gray-50 p-4 rounded-xl shadow
        "
      >
        {/* Ciudad (required) */}
        <select
          name="ciudad"
          required
          onChange={handleChange}
          className="input"
        >
          <option value="">Ciudad</option>
          <option value="medellin">Medellín</option>
          <option value="bogota">Bogotá</option>
        </select>

        {/* Aeropuerto (required SELECT) */}
        <select
          name="aeropuerto"
          required
          onChange={handleChange}
          className="input"
        >
          <option value="">Aeropuerto</option>
          <option value="MDE">José María Córdova (MDE)</option>
          <option value="BOG">El Dorado (BOG)</option>
        </select>

        {/* Fecha Entrada */}
        <input
          type="date"
          name="fechaEntrada"
          onChange={handleChange}
          className="input"
        />

        {/* Hora Entrada */}
        <input
          type="time"
          name="horaEntrada"
          onChange={handleChange}
          className="input"
        />

        {/* Fecha Salida */}
        <input
          type="date"
          name="fechaSalida"
          onChange={handleChange}
          className="input"
        />

        {/* Hora Salida */}
        <input
          type="time"
          name="horaSalida"
          onChange={handleChange}
          className="input"
        />

        {/* Código Descuento */}
        <input
          type="text"
          name="codigo"
          placeholder="Código descuento"
          onChange={handleChange}
          className="input"
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="
            md:col-span-7
            bg-black text-white py-3 rounded-lg font-semibold
            hover:bg-gray-800 transition
          "
        >
          Buscar parqueadero
        </button>
      </div>
    </section>
  );
}
