import { supabase } from "@/app/lib/supabase";

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */

export function calculateTotalDays(
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

export function formatDateFriendly(dateStr: string) {
  const date = new Date(dateStr);

  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export function formatCOP(value: number) {
  return value.toLocaleString("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/* -------------------------------------------------------
   Booking Creation
------------------------------------------------------- */

type CreateBookingParams = {
  parking: any;
  formData: {
    customer_name: string;
    customer_surname: string;
    customer_phone: string;
    vehicle_plate: string;
  };
  vehiculo: string | null;
  fechaEntrada: string;
  horaEntrada: string;
  fechaSalida: string;
  horaSalida: string;
};

export async function createBooking({
  parking,
  formData,
  vehiculo,
  fechaEntrada,
  horaEntrada,
  fechaSalida,
  horaSalida,
}: CreateBookingParams) {
  const totalDays = calculateTotalDays(
    fechaEntrada,
    horaEntrada,
    fechaSalida,
    horaSalida
  );

  const totalPrice = parking.price_per_day * totalDays;

  const payload = {
    parking_id: parking.id,
    operator_id: parking.operator_id,
    customer_name: formData.customer_name,
    customer_surname: formData.customer_surname,
    customer_phone: formData.customer_phone,
    vehicle_plate: formData.vehicle_plate,
    vehicle: vehiculo === "carro" ? "Carro" : "Moto",
    start_date: fechaEntrada,
    entry_time: horaEntrada,
    end_date: fechaSalida,
    exit_time: horaSalida,
    price_per_day: parking.price_per_day,
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
    throw error;
  }

  const coveredLabel = parking.is_covered ? "Bajo Techo" : "Aire Libre";
  const shortReference = "CP-" + data.id.slice(-6).toUpperCase();

  const whatsappMessage = `
Hola

Quiero reservar un parqueadero en *${parking.name}*,
con los siguientes datos:

• *Tipo de parqueadero:* ${coveredLabel}
• *Entrada:* ${formatDateFriendly(fechaEntrada)} - ${horaEntrada}
• *Salida:* ${formatDateFriendly(fechaSalida)} - ${horaSalida}
• *Precio por día:* $${formatCOP(parking.price_per_day)}
• *Total:* $${formatCOP(data.total_price)}

• *Nombre:* ${formData.customer_name} ${formData.customer_surname}
• *Vehículo:* ${vehiculo === "carro" ? "Carro" : "Moto"}
• *Placa:* ${formData.vehicle_plate}
• *Referencia:* ${shortReference}

Enviado desde *ComparaParqueaderos.com*
`.trim();

  const encodedMessage = encodeURIComponent(whatsappMessage);
  const whatsappNumber =
    parking.operators.whatsapp_number.replace(/\D/g, "");

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  return {
    booking: data,
    reference: shortReference,
    whatsappUrl,
  };
}
