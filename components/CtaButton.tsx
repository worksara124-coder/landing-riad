import { offer } from "@/content/offer";
import { reassurance } from "@/content/landing";

/**
 * L'unique appel à l'action : il mène toujours au formulaire du hero (#demande).
 * `data-cta` indique l'emplacement (mesure d'audience). `withNote` ajoute la phrase de réassurance.
 */
export function CtaButton({
  placement,
  className = "",
  label = offer.cta,
  withNote = false,
}: {
  placement: string;
  className?: string;
  label?: string;
  withNote?: boolean;
}) {
  const link = (
    <a href="#demande" data-cta={placement} className={`cta ${className}`}>
      {label}
      <span className="cta-arrow" aria-hidden="true">
        →
      </span>
    </a>
  );
  if (!withNote) return link;
  return (
    <div className="flex flex-col items-start gap-2">
      {link}
      <p className="t-note">{reassurance}</p>
    </div>
  );
}
