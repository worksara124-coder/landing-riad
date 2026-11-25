/**
 * L'offre unique présentée par la landing page. Tout le contenu modifiable est ici.
 *
 * Aucun prix, aucune capacité et aucune prestation supplémentaire n'ont été fournis :
 * - `price: null` affiche « Tarif communiqué sur demande » ;
 * - `capacity: null` désactive le contrôle du nombre maximal de voyageurs ;
 * - `included` ne liste que ce que l'offre est par définition (3 nuits, la suite, le patio, la terrasse).
 * Complétez ces valeurs avant la mise en ligne : la page s'adapte seule.
 */

export type Currency = "MAD" | "EUR";

export interface Offer {
  name: string;
  /** Accent manuscrit affiché sous le nom. */
  accent: string;
  nights: number;
  room: { id: string; name: string };
  promise: string;
  price: { amount: number; currency: Currency; per: "séjour" | "nuit" } | null;
  /** Nombre maximal de voyageurs. `null` = non renseigné. */
  capacity: number | null;
  included: string[];
  /** Conditions à afficher sous l'offre (annulation, validité…). `null` = rien d'affiché. */
  conditions: string | null;
  /** Libellé unique de l'appel à l'action, répété partout sur la page. */
  cta: string;
}

export const offer: Offer = {
  name: "Escapade 3\u00a0nuits",
  accent: "à la Suite Noor",
  nights: 3,
  room: { id: "suite-noor", name: "Suite Noor" },
  promise:
    "Trois nuits pour ralentir : une suite ouverte sur le patio, le murmure de la fontaine et les couchers de soleil sur les toits de Marrakech.",
  price: null,
  capacity: null,
  included: [
    "3 nuits dans la Suite Noor",
    "Une suite ouverte sur le patio et sa fontaine",
    "La terrasse face aux toits de Marrakech",
  ],
  conditions: null,
  cta: "Demander mon escapade",
};

export function formatPrice(price: NonNullable<Offer["price"]>) {
  const amount = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: price.currency,
    maximumFractionDigits: 0,
  }).format(price.amount);
  return { amount, per: price.per === "séjour" ? "le séjour" : "la nuit" };
}
