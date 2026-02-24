import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/app/lib/supabase";
import BookingForm from "@/components/BookingForm";

type Props = {
  params: Promise<{
    airportSlug: string;
    parkingSlug: string;
  }>;
  searchParams: Promise<{
    vehiculo?: string;
    fechaEntrada?: string;
    horaEntrada?: string;
    fechaSalida?: string;
    horaSalida?: string;
    tipo?: string;
    total?: string;
    totalDays?: string;
    offerId?: string;
  }>;
};

import type { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ airportSlug: string; parkingSlug: string }> }
): Promise<Metadata> {
  const { airportSlug, parkingSlug } = await params;

  const { data: airport } = await supabase
    .from("airports")
    .select("id, name, slug, city:cities(name)")
    .eq("slug", airportSlug)
    .single();

  if (!airport) {
    return {};
  }

  const { data: location } = await supabase
    .from("parking_locations")
    .select("name, slug")
    .eq("slug", parkingSlug)
    .eq("airport_id", airport.id)
    .single();

  if (!location) {
    return {};
  }

  const title = `${location.name} cerca del Aeropuerto ${airport.name}`;

  const description = `Reserva ${location.name}, parqueadero cerca del Aeropuerto ${airport.name}. Consulta precios por día, ubicación y servicios disponibles.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/aeropuerto/${airportSlug}/parqueadero/${parkingSlug}`,
    },
    openGraph: {
      title,
      description,
      url: `/aeropuerto/${airportSlug}/parqueadero/${parkingSlug}`,
    },
  };
}

export default async function ParkingPage({ params, searchParams }: Props) {
  const sp = await searchParams;
  const { airportSlug, parkingSlug } = await params;

  const { data: airport } = await supabase
    .from("airports")
    .select("id, name, slug, code, city:cities(id, name, slug)")
    .eq("slug", airportSlug)
    .single();

  if (!airport) return notFound();

  const city = Array.isArray(airport.city)
  ? airport.city[0]
  : airport.city;

  const { data: location } = await supabase
    .from("parking_locations")
    .select(`
      id,
      name,
      slug,
      airport_id,
      description,
      on_arrival,
      on_return,
      location_description,
      address,
      latitude,
      longitude,
      opening_hours,
      terms_and_conditions
    `)
    .eq("slug", parkingSlug)
    .eq("airport_id", airport.id)
    .single();

  if (!location) return notFound();

  const { data: offers } = await supabase
    .from("parkings")
    .select(
      `
        id,
        name,
        operator_id,
        vehicle,
        price_per_day,
        is_covered,
        services,
        offer_features,
        distance_km,
        logo_url,
        operators (
          id,
          name,
          whatsapp_number,
          is_active
        )
      `
    )
    .eq("parking_location_id", location.id)
    .eq("is_active", true);

  function formatDateTime(date?: string, time?: string) {
    if (!date || !time) return "";
    const [year, month, day] = date.split("-").map(Number);
    const [hours, minutes] = time.split(":").map(Number);

    const d = new Date(year, month - 1, day, hours, minutes);

    const months = [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
    ];

    const dd = String(d.getDate()).padStart(2, "0");
    const mmm = months[d.getMonth()];
    const yyyy = d.getFullYear();

    const formattedTime = d.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${dd} ${mmm} ${yyyy} 🕒 ${formattedTime}`;
  }

  const formattedEntrada = formatDateTime(sp?.fechaEntrada, sp?.horaEntrada);
  const formattedSalida = formatDateTime(sp?.fechaSalida, sp?.horaSalida);

  const totalPrice = sp?.total ? Number(sp.total) : null;
  const selectedOfferId = sp?.offerId ?? null;

  const hasSearchParams = Boolean(
    sp?.vehiculo &&
    sp?.tipo &&
    sp?.fechaEntrada &&
    sp?.horaEntrada &&
    sp?.fechaSalida &&
    sp?.horaSalida &&
    sp?.total &&
    sp?.offerId
  );

  const selectedOffer =
    offers && selectedOfferId
      ? offers.find((o) => o.id === selectedOfferId)
      : null;

if (hasSearchParams) {
  if (!selectedOfferId || !selectedOffer) {
    return notFound();
  }

  const operator = Array.isArray(selectedOffer.operators)
    ? selectedOffer.operators[0]
    : selectedOffer.operators;

  if (
    !operator ||
    !operator.is_active ||
    !operator.whatsapp_number
  ) {
    return notFound();
  }
}

  const MobileSidebar = () => (
    <div className="lg:hidden">
      {offers && offers[0]?.logo_url && (
        <div className="w-full mb-6">
          <img
            src={offers[0].logo_url}
            alt={`${location.name} logo`}
            className="w-full h-40 object-contain"
          />
        </div>
      )}

      <div className="mb-3">
        <h1 className="text-2xl font-bold">{location.name}</h1>
        <p className="mt-1 text-gray-500 text-sm">
          Parqueadero cerca del Aeropuerto {airport.name} ({airport.code})
        </p>
      </div>

      {location.description && (
        <div className="mb-6 text-sm text-gray-700 leading-relaxed">
          {location.description}
        </div>
      )}

      {offers && offers[0]?.distance_km && (
        <div className="flex items-center gap-2 text-sm text-gray-700 mb-4">
          <span className="text-gray-500">📍</span>
          <span>
            <strong>
              {offers[0].distance_km < 1
                ? `${Math.round(offers[0].distance_km * 1000)} m`
                : `${Number(offers[0].distance_km.toFixed(1))} km`}
            </strong>{" "}
            del aeropuerto
          </span>
        </div>
      )}

      {offers && offers[0]?.services && (
        <ul className="space-y-1 text-sm text-gray-700 mb-6">
          {offers[0].services
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
            .slice(0, 4)
            .map((service: string) => (
              <li key={service} className="flex items-center gap-2">
                <span className="w-4 text-center text-blue-600 font-semibold">✓</span>
                <span>{service}</span>
              </li>
            ))}
        </ul>
      )}

      {hasSearchParams && (
        <div id="mobile-search-summary" className="bg-blue-50 border border-gray-200 rounded-xl p-4 mb-6">
          <ul className="space-y-2 text-sm">
            {sp?.tipo && (
              <li>
                <strong>Parqueadero:</strong>{" "}
                {sp.tipo === "cubierto"
                  ? "Cubierto"
                  : sp.tipo === "aire-libre"
                  ? "Aire Libre"
                  : sp.tipo}
              </li>
            )}

            {sp?.vehiculo && (
              <li>
                <strong>Vehículo:</strong>{" "}
                {sp.vehiculo.charAt(0).toUpperCase() + sp.vehiculo.slice(1)}
              </li>
            )}

            {formattedEntrada && (
              <li>
                <strong>Entrada:</strong> {formattedEntrada}
              </li>
            )}

            {formattedSalida && (
              <li>
                <strong>Salida:</strong> {formattedSalida}
              </li>
            )}
          
            {totalPrice && (
              <li className="pt-2 border-t border-blue-100">
                <strong>Total:</strong>{" "}
                <span className="font-bold text-green-700 text-xl">
                  $ {Number(totalPrice).toLocaleString("es-CO", {
                    maximumFractionDigits: 0,
                  })}
                </span>
              </li>
            )}
          </ul>
        </div>
      )}

      {location.location_description && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Ubicación</h2>
          <div className="text-sm text-gray-700 leading-relaxed mb-3">
            {location.location_description}
          </div>

          {location.address && (
            <div className="text-sm text-gray-700">
              <strong>Dirección:</strong> {location.address}
            </div>
          )}

          {location.latitude && location.longitude && (
            <div className="mt-4">
              <iframe
                title="Mapa ubicación parqueadero"
                src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&z=14&output=embed`}
                width="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg w-full h-[300px] lg:h-[380px]"
              />
            </div>
          )}
        </div>
      )}

      {location.on_arrival && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Qué hacer al llegar al parqueadero</h2>
          <div className="text-sm text-gray-700 leading-relaxed">
            {location.on_arrival}
          </div>
        </div>
      )}

      {location.on_return && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-3">Qué hacer al regresar de tu viaje</h2>
          <div className="text-sm text-gray-700 leading-relaxed">
            {location.on_return}
          </div>
        </div>
      )}
    </div>
  );

  const DesktopSidebar = () => (
    <div className="hidden lg:block">
      <div>
        <div className="space-y-6 border border-gray-200 rounded-xl p-4">
          {offers && offers[0]?.logo_url && (
            <div className="flex justify-center p-4">
              <img
                src={offers[0].logo_url}
                alt={`${location.name} logo`}
                className="h-[120px] w-auto object-contain"
              />
            </div>
          )}

          {offers && offers[0]?.distance_km && (
            <div className="text-base text-gray-700 flex items-center gap-2">
              <span className="text-gray-500">📍</span>
              <span>
                <strong>
                  {offers[0].distance_km < 1
                    ? `${Math.round(offers[0].distance_km * 1000)} m`
                    : `${Number(offers[0].distance_km.toFixed(1))} km`}
                </strong>{" "}
                del aeropuerto
              </span>
            </div>
          )}

          {(offers && (offers[0]?.services || (sp?.vehiculo && offers[0]?.offer_features))) && (
            <ul className="space-y-1 text-[13px] text-gray-700">
              {offers[0]?.services &&
                offers[0].services
                  .split(",")
                  .map((s: string) => s.trim())
                  .filter(Boolean)
                  .slice(0, 4)
                  .map((service: string) => (
                    <li key={service} className="flex items-center gap-2">
                      <span className="w-4 text-center text-blue-600 font-semibold">✓</span>
                      <span>{service}</span>
                    </li>
                  ))}

              {sp?.vehiculo &&
                offers[0]?.offer_features &&
                offers[0].offer_features
                  .split(",")
                  .map((f: string) => f.trim())
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((feature: string) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="w-4 text-center text-[13px] leading-none">⭐</span>
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
            </ul>
          )}

          {hasSearchParams && (
            <div className="bg-blue-50 border border-gray-200 rounded-xl p-4">
              <ul className="mt-1 space-y-2 text-sm">
                {sp?.tipo && (
                  <li>
                    <strong>Parqueadero:</strong>{" "}
                    {sp.tipo === "cubierto"
                      ? "Cubierto"
                      : sp.tipo === "aire-libre"
                      ? "Aire Libre"
                      : sp.tipo}
                  </li>
                )}

                {sp?.vehiculo && (
                  <li>
                    <strong>Vehículo:</strong>{" "}
                    {sp.vehiculo.charAt(0).toUpperCase() + sp.vehiculo.slice(1)}
                  </li>
                )}

                {formattedEntrada && (
                  <li>
                    <strong>Entrada:</strong> {formattedEntrada}
                  </li>
                )}

                {formattedSalida && (
                  <li>
                    <strong>Salida:</strong> {formattedSalida}
                  </li>
                )}

                {totalPrice && (
                  <li>
                    <input
                      type="checkbox"
                      id="booking-toggle-desktop"
                      className="peer hidden"
                    />

                    <div className="hidden peer-checked:block mt-2 mb-3">
                      <div className="pt-1 mb-4">
                        <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                          Total
                        </div>
                        <div className="text-green-700 font-bold text-2xl">
                          $ {Number(totalPrice).toLocaleString("es-CO", {
                            maximumFractionDigits: 0,
                          })}
                        </div>
                      </div>

                      <BookingForm parking={selectedOffer} searchParams={sp} />
                    </div>

                    <div className="peer-checked:hidden text-xs uppercase tracking-wide text-gray-500 mb-1">
                      Total
                    </div>

                    <div className="peer-checked:hidden flex items-center justify-between gap-3">
                      <div className="text-green-700 font-bold text-2xl">
                        $ {Number(totalPrice).toLocaleString("es-CO", {
                          maximumFractionDigits: 0,
                        })}
                      </div>

                      <label
                        htmlFor="booking-toggle-desktop"
                        className="peer-checked:hidden inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg whitespace-nowrap cursor-pointer"
                      >
                        <img
                          src="/WhatsApp.svg"
                          alt="WhatsApp"
                          className="w-4 h-4"
                        />
                        Reservar
                      </label>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {sp?.vehiculo && (
          <div className="mt-6 text-center">
            {(() => {
              const params = new URLSearchParams({
                city_id: city.id,
                airport_id: airport.id,
                vehiculo: sp.vehiculo ?? "",
                fechaEntrada: sp.fechaEntrada ?? "",
                horaEntrada: sp.horaEntrada ?? "",
                fechaSalida: sp.fechaSalida ?? "",
                horaSalida: sp.horaSalida ?? "",
              });

              return (
                <a
                  href={`/results?${params.toString()}`}
                  className="text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  ← Volver a resultados
                </a>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {location && location.latitude && location.longitude && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ParkingFacility",
              name: location.name,
              description: location.description || undefined,
              address: location.address
                ? {
                    "@type": "PostalAddress",
                    streetAddress: location.address,
                    addressLocality: city?.name || undefined,
                    addressCountry: "CO"
                  }
                : undefined,
              geo: {
                "@type": "GeoCoordinates",
                latitude: location.latitude,
                longitude: location.longitude
              },
              areaServed: airport?.name
                ? {
                    "@type": "Airport",
                    name: airport.name
                  }
                : undefined
            })
          }}
        />
      )}
      <Header />
      <main className="min-h-screen relative">
        <div className="mx-auto max-w-7xl px-4 lg:px-6 py-6 lg:py-10">
          <nav className="hidden lg:block text-sm text-gray-600 mb-6">
            <a href="/" className="hover:underline">Inicio</a>
            {airport?.city && (
              <>
                / <a href={`/ciudad/${city.slug}`} className="hover:underline">
                  {city.name}
                </a>
              </>
            )}
            / <a href={`/aeropuerto/${airport.slug}`} className="hover:underline">
              Aeropuerto {airport.name}
            </a>
            / <span className="text-gray-800">{location.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-10">
            <aside className="w-full lg:w-80 shrink-0">
              <MobileSidebar />
              <DesktopSidebar />
            </aside>

            <div className="flex-1">
              <div className="hidden lg:block mb-6">
                <h1 className="text-3xl font-bold">{location.name}</h1>
                <p className="mt-2 text-gray-500">
                  Parqueadero cerca del Aeropuerto {airport.name} ({airport.code})
                </p>
              </div>

              {location.description && (
                <div className="hidden lg:block mb-6 text-base text-gray-700 leading-relaxed max-w-3xl">
                  {location.description}
                </div>
              )}

              {location.location_description && (
                <div className="hidden lg:block mb-6 max-w-3xl">
                  <h2 className="text-lg font-semibold mb-3">Ubicación</h2>
                  <div className="text-sm lg:text-base text-gray-700 leading-relaxed mb-3">
                    {location.location_description}
                  </div>

                  {location.address && (
                    <div className="text-sm text-gray-700">
                      <strong>Dirección:</strong> {location.address}
                    </div>
                  )}

                  {location.latitude && location.longitude && (
                    <div className="mt-4">
                      <iframe
                        title="Mapa ubicación parqueadero"
                        src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&z=14&output=embed`}
                        width="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="rounded-lg w-full h-[300px] lg:h-[380px]"
                      />
                    </div>
                  )}
                </div>
              )}

              {location.on_arrival && (
                <div className="hidden lg:block mb-6 max-w-3xl">
                  <h2 className="text-lg font-semibold mb-3">Qué hacer al llegar al parqueadero</h2>
                  <div className="text-sm lg:text-base text-gray-700 leading-relaxed">
                    {location.on_arrival}
                  </div>
                </div>
              )}

              {location.on_return && (
                <div className="hidden lg:block mb-6 max-w-3xl">
                  <h2 className="text-lg font-semibold mb-3">Qué hacer al regresar de tu viaje</h2>
                  <div className="text-sm lg:text-base text-gray-700 leading-relaxed">
                    {location.on_return}
                  </div>
                </div>
              )}

              <section>
                <h2 className="text-lg font-semibold mb-6">Tarifas</h2>

                {!offers || offers.length === 0 ? (
                  <p>No hay ofertas activas en este momento.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.map((offer) => (
                      <article
                        key={offer.id}
                        className={`border rounded-lg overflow-hidden h-full flex flex-col justify-between ${
                          selectedOfferId === offer.id
                            ? "border-blue-600"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="bg-blue-50 border-b border-gray-200 px-3 py-2 text-center">
                          <h3 className="text-base font-semibold text-gray-800">
                            Parqueadero {offer.is_covered ? "Cubierto" : "Aire Libre"}
                          </h3>
                          <p className="mt-1 text-base font-semibold text-gray-800">
                            {offer.vehicle}
                          </p>
                        </div>

                        <div className="p-4 flex flex-col items-center justify-between flex-1 text-center">
                          {offer.offer_features && (
                            <ul className="space-y-1 text-sm text-gray-700 mb-3">
                              {offer.offer_features
                                .split(",")
                                .map((f: string) => f.trim())
                                .filter(Boolean)
                                .slice(0, 2)
                                .map((feature: string) => (
                                  <li key={feature} className="flex items-center justify-center gap-2">
                                    <span className="text-gray-400">•</span>
                                    <span>{feature}</span>
                                  </li>
                                ))}
                            </ul>
                          )}

                          <div className="text-center">
                            <div className="text-xl font-bold text-gray-900">
                              $ {offer.price_per_day.toLocaleString("es-CO")}
                            </div>
                            <div className="text-xs text-gray-500">(24 horas)</div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              {location.terms_and_conditions && (
                <div className="mt-10 mb-6 max-w-3xl">
                  <h2 className="text-lg font-semibold mb-3">Términos y condiciones</h2>
                  <div className="text-sm lg:text-base text-gray-700 leading-relaxed">
                    {location.terms_and_conditions}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {totalPrice && (
          <div className="lg:hidden fixed bottom-0 inset-x-0 z-50">
            {sp?.vehiculo && (
              <input
                type="checkbox"
                id="booking-toggle-mobile"
                className="peer hidden"
              />
            )}

            {/* Sticky Bottom Bar */}
            <div className="bg-white border-t border-gray-200 p-4 shadow-lg peer-checked:hidden">
              <div className="flex items-center gap-4">
                <div className="min-w-[120px]">
                  <div className="text-xs uppercase text-gray-500">Total</div>
                  <div className="text-2xl font-bold text-green-700 leading-tight">
                    $ {Number(totalPrice).toLocaleString("es-CO", {
                      maximumFractionDigits: 0,
                    })}
                  </div>
                </div>

                {sp?.vehiculo && (
                  <label
                    htmlFor="booking-toggle-mobile"
                    className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg cursor-pointer"
                  >
                    <img src="/WhatsApp.svg" alt="WhatsApp" className="w-6 h-6" />
                    <span>Reservar</span>
                  </label>
                )}
              </div>
            </div>

            {/* Booking Form */}
            {sp?.vehiculo && (
              <div className="hidden peer-checked:block bg-white border-t border-gray-200 p-4">
                <BookingForm parking={selectedOffer} searchParams={sp} />
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
