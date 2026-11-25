import { Logo } from "./Logo";
import { offer } from "@/content/offer";
import { CtaButton } from "./CtaButton";

/** Footer : logo, signature, rappel de l'offre avec l'action, copyright. Aucun lien sortant. */
export function Footer() {
  return (
    <footer className="border-t border-sable/80 bg-[#f1e9dc] pb-24 pt-10 md:pb-8">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="block h-[34px]">
            <Logo />
          </span>
          <p className="t-note">Un refuge au cœur de Marrakech · Marrakech, Maroc</p>
        </div>
        <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-[16px] border border-sable bg-creme px-5 py-4 sm:flex-row">
          <p className="text-[0.82rem] font-semibold text-brun">
            {offer.name} · {offer.room.name}
          </p>
          <CtaButton placement="footer" className="!min-h-[40px] !px-5 !text-[0.78rem]" />
        </div>
        <p className="t-note mt-6 text-center">© {new Date().getFullYear()} Riad Noor</p>
      </div>
    </footer>
  );
}
