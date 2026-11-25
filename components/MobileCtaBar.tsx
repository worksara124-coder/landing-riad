"use client";

import { useEffect, useState } from "react";
import { offer } from "@/content/offer";

/**
 * Barre d'action fixe sur mobile : visible seulement quand le formulaire (dans le hero) n'est pas à l'écran.
 */
export function MobileCtaBar() {
  const [heroGone, setHeroGone] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    // Le formulaire est dans le hero : la barre prend le relais dès qu'il quitte l'écran.
    const form = document.getElementById("demande");
    const io = new IntersectionObserver(([e]) => {
      setFormVisible(e.isIntersecting);
      setHeroGone(true);
    });
    if (form) io.observe(form);
    return () => io.disconnect();
  }, []);

  const show = heroGone && !formVisible;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-sable bg-creme/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm transition-transform duration-500 md:hidden ${
        show ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      aria-hidden={!show}
      inert={!show}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[0.8rem] font-semibold text-brun">{offer.name}</p>
          <p className="truncate text-[0.7rem] text-brun-logo">
            {offer.room.name} · {offer.nights} nuits
          </p>
        </div>
        <a href="#demande" data-cta="barre-mobile" className="cta !min-h-[40px] shrink-0 !px-4 !text-[0.75rem]">
          Demander
          <span className="cta-arrow" aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </div>
  );
}
