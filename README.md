# Riad Noor — Landing page « Escapade 3 nuits »

Landing page à **offre unique** pour le Riad Noor, séparée du site principal. Elle reprend la même identité : logo, palette, Poppins + Allison, motif zellige, cadres en arche.

Stack : Next.js 16 (App Router) · TypeScript · Tailwind CSS 4. Pas de bibliothèque d'animation : les apparitions passent par `IntersectionObserver` et du CSS, pour une page légère.

## Lancer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run typecheck
```

## Architecture (reprise d'art.nymorr.com)

| # | Section | Composant | Rôle |
|---|---|---|---|
| 1 | Header fixe | `Header` | Logo + bouton « Demander ». Aucune navigation sortante. |
| 2 | **Hero + formulaire** | `Hero`, `DemandeForm` | Accroche, titre, promesse, **formulaire de demande directement dans le hero**, 3 points clés, photo. |
| 3 | Bandeau de chiffres | `Facts` | 4 chiffres de l'offre (3 nuits, 1 suite, 0 paiement en ligne, 2 min). |
| 4 | Problème | `Problem` | « Vous vous reconnaissez ? » + 4 freins numérotés. |
| 5 | Coût de l'attente | `Problem` | « Ce que ça coûte vraiment ». |
| 6 | Solution | `Solution` | « La bonne nouvelle… », ce que vous n'avez plus à gérer, 3 étapes, bouton + réassurance. |
| 7 | Photos | `Gallery` | Vraies photos avec étiquettes : une seule ligne sur grand écran ; sur mobile, défilement au doigt sans barre visible (« Faites glisser… »). |
| 8 | Avis | `Reviews` | **Masquée tant que `reviews` est vide** (`content/landing.ts`). N'y mettez que de vrais avis. |
| 9 | L'offre | `OfferCard` | Remplace le comparatif de packs : une seule carte (inclus, tarif, bouton). |
| 10 | FAQ | `Faq` | 6 questions avant de faire la demande. |
| 11 | Dernier appel | `FinalCta` | Titre, 3 points, bouton, réassurance. |
| 12 | Footer | `Footer` | Logo, signature, rappel de l'offre avec le bouton, ©. |

Comme sur la référence, chaque bouton mène au formulaire du hero (`#demande`) et il est suivi de la même phrase de réassurance : « Disponibilités confirmées avec vous avant toute réservation. » Une barre fixe sur mobile prend le relais quand le formulaire n'est plus à l'écran.

Tous les textes sont dans `content/landing.ts` (sections) et `content/offer.ts` (offre).

## Typographie compacte

Échelle relevée sur art.nymorr.com : H1 27 px, H2 22 px, H3 16 px, textes 13 px, notes 10–11 px, boutons 13 px. Elle est appliquée ici en Poppins, avec des classes définies dans `app/globals.css` :

| Classe | Taille (mobile → grand écran) |
|---|---|
| `.t-h1` | ≈ 26 → 37 px, graisse 600 |
| `.t-h2` | ≈ 21 → 28 px, graisse 600 |
| `.t-h3` | 16 px |
| texte courant | ≈ 13,5 → 14,5 px |
| `.t-kicker`, `.t-note` | 11 px |
| `.cta` | 13 px |

Exception volontaire : les champs du formulaire restent en 16 px, car en dessous, Safari sur iPhone zoome automatiquement sur le champ au toucher.

## Règles de landing page appliquées

- **Un seul objectif :** toutes les actions mènent au formulaire, avec le même libellé.
- **Aucune fuite :** aucun lien vers une autre page ou un autre site.
- **Dès l'arrivée :** titre, promesse et formulaire visibles (vérifié en 1440 × 900 et 390 × 844).
- **Réassurance honnête :** aucun avis inventé, aucune fausse rareté, aucun compte à rebours.
- **Mesure :** chaque bouton porte `data-cta` (header, solution, offre, formulaire, final, footer, barre-mobile).
- **Accessibilité :** un seul H1, labels visibles, erreurs reliées aux champs, FAQ en `<details>`, contenu visible sans JavaScript et avec la réduction des animations.

## Compléter l'offre — `content/offer.ts`

Aucun prix, aucune capacité ni prestation supplémentaire n'ont été fournis. Rien n'est donc inventé :

```ts
price: null,        // → « Communiqué sur demande »
capacity: null,     // → pas de maximum de voyageurs contrôlé
included: [ "3 nuits dans la Suite Noor", ... ],
conditions: null,   // → rien d'affiché
```

Exemple une fois les informations connues :

```ts
price: { amount: 4500, currency: "MAD", per: "séjour" },
capacity: 2,
included: ["3 nuits dans la Suite Noor", "Petit-déjeuner chaque matin", "Transfert depuis l'aéroport"],
conditions: "Offre valable jusqu'au 30 avril. Annulation gratuite jusqu'à 7 jours avant l'arrivée.",
```

La page, la FAQ et la validation du formulaire s'adaptent seules. Le nom, l'accent manuscrit, la promesse et le libellé du bouton se trouvent dans le même fichier.

## Images

`public/images/` contient les photos du Riad Noor en résolution native (suite, terrasse, fontaine, patio, bois sculpté), ainsi que le logo et le motif. Pour les remplacer, gardez le même nom de fichier. Si vous changez un cadrage, ajustez l'attribut `sizes` : une photo paysage dans un cadre portrait est affichée plus large que son cadre.

## Recevoir les demandes

Sans configuration, une demande valide n'est **pas** transmise et le visiteur en est informé : aucun envoi réussi n'est simulé.

1. Créez un point de réception qui accepte un `POST` JSON : Make, Zapier, n8n, CRM ou votre propre API.
2. Définissez côté serveur (`.env.local` ou chez l'hébergeur) :
   ```
   ESCAPADE_WEBHOOK_URL=https://…
   ESCAPADE_WEBHOOK_SECRET=…   # facultatif, envoyé dans l'en-tête X-Riad-Noor-Secret
   ```
3. Reconstruisez (`npm run build`).

`app/api/demande/route.ts` revalide les données, ignore les robots (champ piège) et envoie :

```json
{ "type": "demande_escapade", "offer": { "name": "Escapade 3 nuits", "nights": 3, "room": { "id": "suite-noor", "name": "Suite Noor" } },
  "arrival": "2027-03-10", "departure": "2027-03-13", "guests": 2, "fullName": "…", "phone": "…", "email": "…", "message": "…" }
```

## Vérifié

Build et TypeScript sans erreur, et 25 vérifications automatiques dans Chrome :
- un seul H1, aucun lien sortant, toutes les actions vers le formulaire ;
- ordre des sections conforme à l'architecture, échelle typographique compacte respectée ;
- titre et formulaire visibles dès l'arrivée (ordinateur et mobile) ;
- erreurs du formulaire et focus, arrivée passée refusée, départ = arrivée + 3 nuits, compteur de voyageurs, e-mail invalide ;
- demande valide sans service : message honnête et aucune requête envoyée ;
- FAQ, barre mobile (apparition et masquage), aucun débordement horizontal ;
- aucune erreur console ni ressource cassée ;
- contenu visible avec la réduction des animations et sans JavaScript.
