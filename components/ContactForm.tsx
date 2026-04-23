"use client";

import { useState } from "react";

export default function ContactForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, email, mensaje }),
    });

    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setNombre("");
      setEmail("");
      setMensaje("");
    } else {
      alert("Error al enviar el mensaje");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre
        </label>
        <input
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Correo electrónico
        </label>
        <input
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mensaje
        </label>
        <textarea
          rows={5}
          placeholder="Escribe tu mensaje aquí..."
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        {loading ? "Enviando..." : "Enviar mensaje"}
      </button>

      {/* Success message */}
      {success && (
        <p className="text-green-600">
          Mensaje enviado correctamente ✅
        </p>
      )}
    </form>
  );
}