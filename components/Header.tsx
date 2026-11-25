import { Logo } from "./Logo";
import { CtaButton } from "./CtaButton";

/** Header compact et fixe : logo + action. Aucune navigation qui ferait sortir de la page. */
export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 h-[var(--header-h)] border-b border-sable/60 bg-creme/92 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-[1180px] items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" aria-label="Riad Noor — haut de page" className="block h-[30px] sm:h-[34px]">
          <Logo priority />
        </a>
        <CtaButton placement="header" label="Demander" className="!min-h-[38px] !px-4 !text-[0.78rem]" />
      </div>
    </header>
  );
}
