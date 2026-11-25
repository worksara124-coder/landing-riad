/**
 * Textes de la landing, section par section (même ordre que la page).
 * Architecture reprise d'art.nymorr.com : hero + formulaire, chiffres, problème, coût de l'attente,
 * solution en 3 étapes, carrousel, avis, offre, FAQ, dernier appel, footer.
 */
import { offer } from "./offer";

/** Phrase de réassurance répétée sous chaque bouton. */
export const reassurance = "Disponibilités confirmées avec vous avant toute réservation.";

export const hero = {
  eyebrow: `${offer.name} · ${offer.room.name} · Marrakech`,
  title: "Trois nuits au calme, au cœur de Marrakech",
  intro:
    "Une suite ouverte sur le patio, le murmure de la fontaine et les couchers de soleil sur les toits de la médina. Choisissez votre date d’arrivée : on s’occupe du reste.",
  bullets: ["3 nuits dans la Suite Noor", "Départ calculé automatiquement", "Aucun paiement en ligne"],
};

/** Bandeau de chiffres sous le hero (uniquement des faits de l'offre). */
export const facts = [
  { value: `${offer.nights}`, label: "nuits d’escapade" },
  { value: "1", label: "suite ouverte sur le patio" },
  { value: "0", label: "paiement en ligne" },
  { value: "2 min", label: "pour envoyer la demande" },
];

export const problem = {
  kicker: "Vous vous reconnaissez ?",
  title: "Partir à Marrakech, ça a l’air simple… jusqu’au moment de choisir où dormir.",
  pains: [
    "Vous rêvez de calme, mais la plupart des adresses donnent sur le bruit de la ville.",
    "Les photos promettent beaucoup, et vous ne savez pas à quoi ressemblera vraiment la chambre.",
    "Vous comparez des dizaines d’offres sans trouver celle qui a du caractère.",
    "Vous repoussez, faute de temps pour tout organiser.",
  ],
  costTitle: "Ce que ça coûte vraiment",
  cost: [
    "Chaque escapade repoussée, c’est un week-end de repos qui ne viendra pas tout seul.",
    "Et une adresse choisie à la hâte peut transformer trois jours de pause en trois jours de compromis.",
  ],
};

export const solution = {
  title: "La bonne nouvelle : votre escapade est déjà pensée.",
  noMore: [
    "Plus besoin de comparer des dizaines d’adresses.",
    "Plus besoin de calculer vos dates : le départ se fixe seul.",
    "Plus besoin de payer pour poser une question.",
  ],
  steps: [
    { title: "Choisissez votre arrivée", text: `L’escapade dure ${offer.nights} nuits : la date de départ se calcule automatiquement.` },
    { title: "Envoyez votre demande", text: "Quelques informations suffisent, en moins de deux minutes." },
    { title: "Recevez la confirmation", text: "Le riad vous confirme les disponibilités pour vos dates." },
  ],
};

/** Carrousel « le riad en images » : uniquement de vraies photos. */
export const gallery = {
  title: "La Suite Noor et le riad, tels qu’ils sont",
  intro: "Bois sculpté, zellige, laiton : des matières chaudes et une lumière douce à chaque heure.",
  hint: "Faites glisser pour voir les photos",
  items: [
    { src: "/images/suite-noor.webp", title: "La Suite Noor", tags: ["Alcôve", "Salon"], position: "62% 50%" },
    { src: "/images/fontaine.webp", title: "Le patio et sa fontaine", tags: ["Zellige", "Calme"], position: "50% 70%" },
    { src: "/images/terrasse.webp", title: "La terrasse au coucher du soleil", tags: ["Vue", "Médina"], position: "60% 50%" },
    { src: "/images/seuil.webp", title: "L’arrivée dans le patio", tags: ["Portes sculptées"], position: "50% 50%" },
    { src: "/images/lit.webp", title: "Le bois ciselé", tags: ["Artisanat"], position: "70% 40%" },
  ],
};

/**
 * Avis clients : vide par défaut, et la section est alors masquée.
 * N'ajoutez ici que de vrais avis (avec l'accord des clients).
 */
export const reviews: { quote: string; name: string; city: string }[] = [];

export const faq = [
  {
    q: "Est-ce une réservation ferme ?",
    a: "Non. Vous envoyez une demande pour vos dates ; le riad vous confirme ensuite les disponibilités. Rien n’est payé en ligne.",
  },
  {
    q: "Puis-je choisir mes dates ?",
    a: `Oui : choisissez votre date d’arrivée, le départ est fixé ${offer.nights} nuits plus tard.`,
  },
  {
    q: "Quel est le tarif ?",
    a: offer.price
      ? "Le tarif est indiqué dans le détail de l’offre."
      : "Le tarif vous est communiqué avec la confirmation de disponibilité, selon vos dates.",
  },
  {
    q: "Combien de voyageurs peuvent séjourner ?",
    a: offer.capacity
      ? `L’offre accueille jusqu’à ${offer.capacity} voyageurs.`
      : "Indiquez le nombre de voyageurs dans votre demande : le riad vous confirme la possibilité avec les disponibilités.",
  },
  {
    q: "Comment se passe le paiement ?",
    a: "Aucun paiement n’est demandé sur cette page. Les modalités vous sont précisées avec la confirmation.",
  },
  {
    q: "Puis-je ajouter une demande particulière ?",
    a: "Oui : une occasion à fêter, une heure d’arrivée… précisez-la au riad lorsqu’il vous recontacte.",
  },
];

export const finalCta = {
  title: "Offrez-vous trois nuits au Riad Noor",
  bullets: ["Votre date d’arrivée au choix", "Une suite ouverte sur le patio", "Aucun paiement en ligne"],
};
