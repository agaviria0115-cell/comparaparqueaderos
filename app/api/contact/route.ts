import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { nombre, email, mensaje } = await req.json();

    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "Comparaparqueaderos <onboarding@resend.dev>", // later change to your domain
      to: ["hola@comparaparqueaderos.com"],
      subject: "Nuevo mensaje de contacto",
      replyTo: email,
      html: `
        <h2>Nuevo mensaje desde el formulario</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json(
      { error: "Error sending email" },
      { status: 500 }
    );
  }
}