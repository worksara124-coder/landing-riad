/**
 * Point d'intégration serveur des demandes d'escapade.
 *
 * Sans `ESCAPADE_WEBHOOK_URL`, la route répond 503 et ne transmet rien.
 * Avec : la demande est revalidée puis envoyée en JSON (POST) à cette URL,
 * avec l'en-tête `X-Riad-Noor-Secret` si `ESCAPADE_WEBHOOK_SECRET` est défini.
 * Ces variables restent côté serveur (pas de préfixe NEXT_PUBLIC_).
 */
import { NextResponse } from "next/server";
import { offer } from "@/content/offer";
import { addDays, departureFor, emptyValues, fields, isoDate, validate, type Values } from "@/lib/demande";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const url = process.env.ESCAPADE_WEBHOOK_URL;
  if (!url) {
    return NextResponse.json({ ok: false, code: "not_configured" }, { status: 503 });
  }

  const raw = await request.text();
  if (raw.length > 10_000) return NextResponse.json({ ok: false, code: "too_large" }, { status: 413 });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, code: "invalid_json" }, { status: 400 });
  }

  // Champ piège invisible : rempli = robot.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: false, code: "rejected" }, { status: 400 });
  }

  const values: Values = emptyValues();
  for (const f of fields) values[f] = typeof body[f] === "string" ? (body[f] as string).trim() : "";

  // Tolérance d'un jour pour les fuseaux en avance sur le serveur.
  const errors = validate(values, addDays(isoDate(new Date(), true), -1));
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, code: "invalid", errors }, { status: 422 });

  const payload = {
    type: "demande_escapade",
    receivedAt: new Date().toISOString(),
    offer: { name: offer.name, nights: offer.nights, room: offer.room },
    arrival: values.arrival,
    departure: departureFor(values.arrival),
    guests: Number(values.guests),
    fullName: values.fullName,
    phone: values.phone,
    email: values.email,
    message: values.message,
  };

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.ESCAPADE_WEBHOOK_SECRET) headers["X-Riad-Noor-Secret"] = process.env.ESCAPADE_WEBHOOK_SECRET;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`[demande] Le service a répondu ${res.status}`);
      return NextResponse.json({ ok: false, code: "upstream_error" }, { status: 502 });
    }
  } catch (error) {
    console.error("[demande] Échec de l'envoi", error);
    return NextResponse.json({ ok: false, code: "upstream_unreachable" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
