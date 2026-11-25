import { Header } from "@/components/Header";
import { Hero, Facts, Problem, Solution, Gallery, Reviews, OfferCard, Faq, FinalCta } from "@/components/Sections";
import { Footer } from "@/components/Footer";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { Reveal } from "@/components/Reveal";

/**
 * Landing page à offre unique, sur l'architecture d'art.nymorr.com :
 * Hero + formulaire → Chiffres → Problème / Coût → Solution → Carrousel → Avis → Offre → FAQ → Dernier appel → Footer.
 * Une seule action partout : « Demander mon escapade » (#demande, le formulaire du hero).
 */
export default function Page() {
  // Lu côté serveur : l'URL du service d'envoi n'est jamais exposée au navigateur.
  const enabled = Boolean(process.env.ESCAPADE_WEBHOOK_URL);
  return (
    <>
      <a href="#demande" className="sr-only z-50 rounded-full bg-brun px-5 py-3 text-creme focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Aller directement au formulaire
      </a>
      <Header />
      <main>
        <Hero enabled={enabled} />
        <Facts />
        <Problem />
        <Solution />
        <Gallery />
        <Reviews />
        <OfferCard />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <MobileCtaBar />
      <Reveal />
    </>
  );
}
