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

  const labelStyle = {
  fontSize: "14px",
  fontWeight: 500,
  marginBottom: "4px",
  display: "block",
  };

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
        <div>
        <label style={labelStyle}>Ciudad</label>
        <select name="ciudad" onChange={handleChange}>
            <option value="">Selecciona ciudad</option>
            <option value="medellin">Medellín</option>
            <option value="bogota">Bogotá</option>
        </select>
        </div>

        {/* Aeropuerto (required SELECT) */}
        <div>
        <label style={labelStyle}>Aeropuerto</label>
        <select name="aeropuerto" onChange={handleChange}>
            <option value="">Selecciona aeropuerto</option>
            <option value="MDE">José María Córdova (MDE)</option>
            <option value="BOG">El Dorado (BOG)</option>
        </select>
        </div>

        {/* Fecha Entrada */}
        <div>
        <label style={labelStyle}>Fecha de entrada</label>
        <input type="date" name="fechaEntrada" onChange={handleChange} />
        </div>

        {/* Hora Entrada */}
        <div>
        <label style={labelStyle}>Hora de entrada</label>
        <input type="time" name="horaEntrada" onChange={handleChange} />
        </div>

        {/* Fecha Salida */}
        <div>
        <label style={labelStyle}>Fecha de salida</label>
        <input type="date" name="fechaSalida" onChange={handleChange} />
        </div>

        {/* Hora Salida */}
        <div>
        <label style={labelStyle}>Hora de salida</label>
        <input type="time" name="horaSalida" onChange={handleChange} />
        </div>

        {/* Código Descuento */}
        <div>
        <label style={labelStyle}>Código de descuento</label>
        <input
            type="text"
            name="codigo"
            placeholder="Opcional"
            onChange={handleChange}
        />
        </div>

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
