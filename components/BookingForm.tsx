"use client";

import { useState } from "react";
import { createBookingAction } from "@/app/actions/createBookingAction";

type Props = {
  parking: any;
  searchParams: any;
};

export default function BookingForm({ parking, searchParams }: Props) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!parking) return null;

  async function handleSubmit(formData: FormData) {
    const result = await createBookingAction(formData);

    if (result?.whatsappUrl) {
      // Open WhatsApp in new tab
      window.open(result.whatsappUrl, "_blank");

      // Replace form with confirmation
      setIsSubmitted(true);
    }
  }

  // ✅ Confirmation state
  if (isSubmitted) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
        <div className="text-green-600 text-3xl mb-3">✓</div>
        <h3 className="text-lg font-semibold mb-2">
          Solicitud enviada
        </h3>
        <p className="text-sm text-gray-600">
          Se abrió WhatsApp en una nueva pestaña.
          <br />
          Si no se abrió automáticamente, revisa tu navegador.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 relative">
      {/* Close X Desktop */}
      <label
        htmlFor="booking-toggle-desktop"
        className="hidden lg:block absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer text-lg leading-none"
      >
        ✕
      </label>

      {/* Close X Mobile */}
      <label
        htmlFor="booking-toggle-mobile"
        className="lg:hidden absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer text-lg leading-none"
      >
        ✕
      </label>

      <form id="booking-form" action={handleSubmit} className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-800 pr-8">
          Completa tus datos para reservar
        </h3>

        {/* Hidden booking data */}
        <input type="hidden" name="parking_id" value={parking.id} />
        <input type="hidden" name="vehiculo" value={searchParams?.vehiculo ?? ""} />
        <input type="hidden" name="fechaEntrada" value={searchParams?.fechaEntrada ?? ""} />
        <input type="hidden" name="horaEntrada" value={searchParams?.horaEntrada ?? ""} />
        <input type="hidden" name="fechaSalida" value={searchParams?.fechaSalida ?? ""} />
        <input type="hidden" name="horaSalida" value={searchParams?.horaSalida ?? ""} />

        <input
          name="customer_name"
          type="text"
          placeholder="Nombre"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />

        <input
          name="customer_surname"
          type="text"
          placeholder="Apellido"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />

        <input
          name="customer_phone"
          type="tel"
          placeholder="Número Celular"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />

        <input
          name="vehicle_plate"
          type="text"
          placeholder="Placa"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          <span className="flex items-center justify-center gap-2">
            <img
              src="/WhatsApp.svg"
              alt="WhatsApp"
              className="w-5 h-5"
            />
            Reservar por WhatsApp
          </span>
        </button>
      </form>
    </div>
  );
}