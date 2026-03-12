"use server";

import { supabase } from "@/app/lib/supabase";

export async function createBookingAction(formData: FormData) {
  const parkingId = formData.get("parking_id") as string;
  const vehiculo = formData.get("vehiculo") as string;
  const fechaEntrada = formData.get("fechaEntrada") as string;
  const horaEntrada = formData.get("horaEntrada") as string;
  const fechaSalida = formData.get("fechaSalida") as string;
  const horaSalida = formData.get("horaSalida") as string;

  const customer_name = formData.get("customer_name") as string;
  const customer_surname = formData.get("customer_surname") as string;
  const customer_phone = formData.get("customer_phone") as string;
  const vehicle_plate = formData.get("vehicle_plate") as string;

  if (
    !parkingId ||
    !vehiculo ||
    !fechaEntrada ||
    !horaEntrada ||
    !fechaSalida ||
    !horaSalida ||
    !customer_name ||
    !customer_surname ||
    !customer_phone ||
    !vehicle_plate
  ) {
    throw new Error("Missing required booking fields");
  }

  const { data: parking } = await supabase
    .from("parkings")
    .select(`
      id,
      name,
      operator_id,
      price_per_day,
      is_covered,
      operators (
        id,
        whatsapp_number,
        is_active
      )
    `)
    .eq("id", parkingId)
    .eq("is_active", true)
    .single();

    if (!parking) {
      throw new Error("Invalid parking");
    }

    const { data: operator } = await supabase
      .from("operators")
      .select("id, whatsapp_number, is_active")
      .eq("id", parking.operator_id)
      .single();

    if (!operator || !operator.is_active || !operator.whatsapp_number) {
      throw new Error("Invalid parking or inactive operator");
    }

  function formatDateTime(date: string, time: string) {
    const [year, month, day] = date.split("-").map(Number);
    const [hours, minutes] = time.split(":").map(Number);

    const d = new Date(year, month - 1, day, hours, minutes);

    const months = [
      "Ene","Feb","Mar","Abr","May","Jun",
      "Jul","Ago","Sep","Oct","Nov","Dic"
    ];

    const dd = String(d.getDate()).padStart(2, "0");
    const mmm = months[d.getMonth()];
    const yyyy = d.getFullYear();

    const formattedTime = d.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${dd} ${mmm} ${yyyy} - ${formattedTime}`;
  }

  const start = new Date(`${fechaEntrada}T${horaEntrada}`);
  const end = new Date(`${fechaSalida}T${horaSalida}`);

  const diffMs = end.getTime() - start.getTime();
  const totalDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  const totalPrice = parking.price_per_day * totalDays;

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      parking_id: parking.id,
      operator_id: parking.operator_id,
      customer_name,
      customer_surname,
      customer_phone,
      vehicle_plate,
      vehicle: vehiculo === "carro" ? "Carro" : "Moto",
      start_date: fechaEntrada,
      entry_time: horaEntrada,
      end_date: fechaSalida,
      exit_time: horaSalida,
      price_per_day: parking.price_per_day,
      total_days: totalDays,
      total_price: totalPrice,
      status: "initiated",
    })
    .select()
    .single();

  if (error || !booking) {
    throw new Error("Failed to create booking");
  }

  const coveredLabel = parking.is_covered ? "Bajo Techo" : "Aire Libre";
  const shortReference = "CP-" + booking.id.slice(-6).toUpperCase();

  const formattedEntrada = formatDateTime(fechaEntrada, horaEntrada);
  const formattedSalida = formatDateTime(fechaSalida, horaSalida);

  const whatsappMessage = `
Hola

Quiero reservar un parqueadero en *${parking.name}*,
con los siguientes datos:

• *Tipo de parqueadero:* ${coveredLabel}
• *Entrada:* ${formattedEntrada}
• *Salida:* ${formattedSalida}
• *Precio por día:* $${parking.price_per_day.toLocaleString("es-CO")}
• *Total:* $${totalPrice.toLocaleString("es-CO")}

• *Nombre:* ${customer_name} ${customer_surname}
• *Vehículo:* ${vehiculo === "carro" ? "Carro" : "Moto"}
• *Placa:* ${vehicle_plate}
• *Referencia:* ${shortReference}

Enviado desde *ComparaParqueaderos.com*
`.trim();

  const encodedMessage = encodeURIComponent(whatsappMessage);
  const whatsappNumber = operator.whatsapp_number.replace(/\D/g, "");

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  return { whatsappUrl };
}
