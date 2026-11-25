/**
 * Validation de la demande d'escapade, partagée par le formulaire et le serveur.
 * La date de départ n'est pas saisie : elle découle de l'arrivée + le nombre de nuits de l'offre.
 */
import { offer } from "@/content/offer";

export const fields = ["arrival", "guests", "fullName", "phone", "email", "message"] as const;
export type Field = (typeof fields)[number];
export type Values = Record<Field, string>;
export type Errors = Partial<Record<Field, string>>;

export const MESSAGE_MAX = 1500;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_CHARS = /^[+()\d\s.\-]+$/;

export function isoDate(date: Date, utc = false): string {
  const y = utc ? date.getUTCFullYear() : date.getFullYear();
  const m = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
  const d = utc ? date.getUTCDate() : date.getDate();
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return isoDate(new Date(Date.UTC(y, m - 1, d + days)), true);
}

export function isValidDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

export function departureFor(arrival: string): string | null {
  return isValidDate(arrival) ? addDays(arrival, offer.nights) : null;
}

export function emptyValues(): Values {
  return { arrival: "", guests: "2", fullName: "", phone: "", email: "", message: "" };
}

export function validate(values: Values, minArrival: string): Errors {
  const errors: Errors = {};
  const v = (f: Field) => (values[f] ?? "").trim();

  const arrival = v("arrival");
  if (!arrival) errors.arrival = "Indiquez votre date d’arrivée.";
  else if (!isValidDate(arrival)) errors.arrival = "Cette date n’est pas valide.";
  else if (arrival < minArrival) errors.arrival = "La date d’arrivée ne peut pas être déjà passée.";

  const guests = v("guests");
  if (!guests) errors.guests = "Indiquez le nombre de voyageurs.";
  else if (!/^\d+$/.test(guests) || Number(guests) < 1) errors.guests = "Indiquez un nombre entier de voyageurs, au moins 1.";
  else if (offer.capacity != null && Number(guests) > offer.capacity)
    errors.guests = `L’offre accueille au maximum ${offer.capacity} voyageur${offer.capacity > 1 ? "s" : ""}.`;

  const name = v("fullName");
  if (!name) errors.fullName = "Indiquez votre nom complet.";
  else if (name.length < 2 || name.length > 120) errors.fullName = "Indiquez un nom complet valide.";

  const phone = v("phone");
  const digits = phone.replace(/\D/g, "");
  if (!phone) errors.phone = "Indiquez votre numéro de téléphone.";
  else if (!PHONE_CHARS.test(phone) || digits.length < 6 || digits.length > 20)
    errors.phone = "Indiquez un numéro valide, par exemple +212 6 00 00 00 00.";

  const email = v("email");
  if (!email) errors.email = "Indiquez votre adresse e-mail.";
  else if (!EMAIL.test(email) || email.length > 254) errors.email = "Indiquez une adresse e-mail valide, par exemple nom@domaine.com.";

  if (v("message").length > MESSAGE_MAX) errors.message = `Votre message ne doit pas dépasser ${MESSAGE_MAX} caractères.`;

  return errors;
}
