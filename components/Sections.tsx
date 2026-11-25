/**
 * Sections de la landing, dans l'ordre de l'architecture d'art.nymorr.com :
 * Hero (+ formulaire) → Chiffres → Problème → Coût de l'attente → Solution (3 étapes)
 * → Carrousel → Avis (si renseignés) → Offre → FAQ → Dernier appel.
 */
import Image from "next/image";
import { offer, formatPrice } from "@/content/offer";
import { facts, faq, finalCta, gallery, hero, problem, reassurance, reviews, solution } from "@/content/landing";
import { CtaButton } from "./CtaButton";
import { DemandeForm } from "./DemandeForm";

const Check = () => (
  <span className="mt-[0.3em] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-olive/15 text-olive" aria-hidden="true">
    <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M2.5 6.5l2.3 2.3L9.5 3.5" />
    </svg>
  </span>
);

const Wrap = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto max-w-[1180px] px-4 sm:px-6 ${className}`}>{children}</div>
);

/* 1. Hero : promesse + formulaire de demande, photo à côté. */
export function Hero({ enabled }: { enabled: boolean }) {
  return (
    <section id="top" aria-labelledby="hero-titre" className="motif motif-sides pb-12 pt-[calc(var(--header-h)+1.75rem)] sm:pb-16 lg:pt-[calc(var(--header-h)+3rem)]">
      <Wrap className="grid items-start gap-8 lg:grid-cols-[1fr_0.92fr] lg:gap-12">
        <div>
          <p className="t-kicker">{hero.eyebrow}</p>
          <h1 id="hero-titre" className="t-h1 mt-3 max-w-[18ch] text-brun">
            {hero.title}
          </h1>
          <p className="t-lead mt-3 max-w-[52ch]">{hero.intro}</p>

          <div className="mt-6 max-w-[520px]">
            <DemandeForm enabled={enabled} />
          </div>

          <ul className="mt-5 grid gap-2 text-[0.82rem] text-brun sm:grid-cols-3" aria-label="L’essentiel">
            {hero.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <Check />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[480px] lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
          <div className="arch relative aspect-[4/4.5] bg-sable shadow-[0_30px_70px_-40px_rgb(53_39_31/0.55)]">
            <Image
              src="/images/suite-noor.webp"
              alt="La Suite Noor : lit sous une alcôve, salon avec plateau à thé et grandes portes ouvertes sur le patio."
              fill
              priority
              quality={90}
              sizes="(min-width: 1024px) 60vw, 130vw"
              className="hero-photo object-cover"
              style={{ objectPosition: "62% 50%" }}
            />
          </div>
          <span className="absolute -right-1 top-[9%] flex h-16 w-16 rotate-[8deg] flex-col items-center justify-center rounded-full bg-olive text-creme shadow-lg">
            <span className="text-[1.35rem] font-light leading-none">{offer.nights}</span>
            <span className="text-[0.55rem] font-semibold uppercase tracking-[0.18em]">nuits</span>
          </span>
        </div>
      </Wrap>
    </section>
  );
}

/* 2. Bandeau de chiffres. */
export function Facts() {
  return (
    <section aria-label="L’offre en chiffres" className="border-y border-sable/70 bg-white/60 py-6">
      <Wrap>
        <ul className="grid grid-cols-2 gap-y-5 md:grid-cols-4">
          {facts.map((f) => (
            <li key={f.label} className="text-center">
              <p className="text-[1.35rem] font-semibold tracking-[-0.02em] text-terracotta-fonce">{f.value}</p>
              <p className="t-note mt-0.5">{f.label}</p>
            </li>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}

/* 3 + 4. Problème et coût de l'attente. */
export function Problem() {
  return (
    <section aria-labelledby="probleme-titre" className="py-14 sm:py-20">
      <Wrap className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div data-reveal>
          <p className="t-kicker">{problem.kicker}</p>
          <h2 id="probleme-titre" className="t-h2 mt-3 max-w-[26ch] text-brun">
            {problem.title}
          </h2>
          <ol className="mt-6 space-y-3">
            {problem.pains.map((p, i) => (
              <li key={p} className="flex gap-3 rounded-[14px] border border-sable/70 bg-[#fbf8f2] p-4 text-[0.84rem] text-brun">
                <span className="text-[0.72rem] font-semibold text-terracotta-fonce">{String(i + 1).padStart(2, "0")}</span>
                {p}
              </li>
            ))}
          </ol>
        </div>
        <div data-reveal style={{ "--d": 1 } as React.CSSProperties} className="self-center rounded-[20px] bg-[#f1e9dc] p-6 sm:p-8">
          <h3 className="t-h3 text-brun">{problem.costTitle}</h3>
          {problem.cost.map((c) => (
            <p key={c} className="t-lead mt-3">
              {c}
            </p>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

/* 5. Solution : ce qu'on n'a plus à gérer + 3 étapes + action. */
export function Solution() {
  return (
    <section aria-labelledby="solution-titre" className="motif motif-sides bg-[#f1e9dc] py-14 sm:py-20">
      <Wrap>
        <div data-reveal className="max-w-[640px]">
          <h2 id="solution-titre" className="t-h2 text-brun">
            {solution.title}
          </h2>
          <ul className="mt-5 space-y-2">
            {solution.noMore.map((n) => (
              <li key={n} className="flex items-start gap-2 text-[0.86rem] text-brun">
                <Check />
                {n}
              </li>
            ))}
          </ul>
        </div>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {solution.steps.map((s, i) => (
            <li key={s.title} data-reveal style={{ "--d": i } as React.CSSProperties} className="rounded-[16px] border border-sable bg-creme p-5">
              <span className="text-[0.72rem] font-semibold tracking-[0.12em] text-terracotta-fonce">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="t-h3 mt-2 text-brun">{s.title}</h3>
              <p className="mt-1.5 text-[0.82rem] text-brun-logo">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <CtaButton placement="solution" withNote />
        </div>
      </Wrap>
    </section>
  );
}

/* 6. Carrousel horizontal de vraies photos (défilement natif, accrochage). */
export function Gallery() {
  return (
    <section aria-labelledby="galerie-titre" className="py-14 sm:py-20">
      <Wrap>
        <div data-reveal className="max-w-[620px]">
          <h2 id="galerie-titre" className="t-h2 text-brun">
            {gallery.title}
          </h2>
          <p className="t-lead mt-3">{gallery.intro}</p>
          <p className="t-note mt-4 flex items-center gap-2 lg:hidden" aria-hidden="true">
            <span>↔</span>
            {gallery.hint}
          </p>
        </div>
      </Wrap>
      {/* Mobile/tablette : défilement au doigt, sans barre visible. Grand écran : une seule ligne, sans défilement. */}
      <ul
        className="no-scrollbar mx-auto mt-6 flex max-w-[1180px] snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 sm:scroll-px-6 sm:px-6 lg:grid lg:snap-none lg:grid-cols-5 lg:overflow-visible"
        aria-label="Photos du riad"
      >
        {gallery.items.map((g) => (
          <li key={g.src} className="w-[72vw] max-w-[300px] shrink-0 snap-start lg:w-auto lg:max-w-none">
            <div className="arch relative aspect-[3/4] bg-sable">
              <Image src={g.src} alt={g.title} fill quality={90} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 560px, 140vw" className="object-cover" style={{ objectPosition: g.position }} />
            </div>
            <p className="mt-3 text-[0.86rem] font-semibold text-brun">{g.title}</p>
            <p className="mt-1 flex flex-wrap gap-1.5">
              {g.tags.map((t) => (
                <span key={t} className="rounded-full bg-[#efe7da] px-2.5 py-0.5 text-[0.68rem] text-brun-logo">
                  {t}
                </span>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* 7. Avis : masqué tant qu'aucun vrai avis n'est renseigné (content/landing.ts). */
export function Reviews() {
  if (reviews.length === 0) return null;
  return (
    <section aria-labelledby="avis-titre" className="bg-[#f1e9dc] py-14 sm:py-20">
      <Wrap>
        <h2 id="avis-titre" className="t-h2 text-brun">
          Ils ont séjourné au Riad Noor
        </h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {reviews.map((r) => (
            <li key={r.name + r.quote} className="rounded-[16px] border border-sable bg-creme p-5">
              <blockquote className="text-[0.86rem] text-brun">« {r.quote} »</blockquote>
              <p className="mt-4 flex items-center gap-2.5 text-[0.78rem] text-brun-logo">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sable font-semibold text-brun" aria-hidden="true">
                  {r.name.charAt(0)}
                </span>
                {r.name} · {r.city}
              </p>
            </li>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}

/* 8. L'offre (à la place du comparatif de packs : une seule carte). */
export function OfferCard() {
  const price = offer.price ? formatPrice(offer.price) : null;
  return (
    <section id="offre" aria-labelledby="offre-titre" className="motif motif-sides bg-[#f1e9dc] py-14 sm:py-20">
      <Wrap>
        <h2 id="offre-titre" data-reveal className="t-h2 mx-auto max-w-[24ch] text-center text-brun">
          Une seule offre, pensée pour ralentir.
        </h2>
        <article
          data-reveal
          className="mx-auto mt-8 max-w-[860px] overflow-hidden rounded-[22px] border border-sable bg-creme shadow-[0_24px_60px_-40px_rgb(53_39_31/0.5)] md:grid md:grid-cols-[0.9fr_1.1fr]"
        >
          <div className="relative aspect-[4/3] md:aspect-auto">
            <Image src="/images/terrasse.webp" alt="La terrasse au coucher du soleil, face aux toits de Marrakech." fill quality={90} sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            <span className="absolute left-4 top-4 rounded-full bg-creme/95 px-3 py-1 text-[0.68rem] font-semibold text-brun">
              {offer.nights} nuits · {offer.room.name}
            </span>
          </div>
          <div className="p-6 sm:p-8">
            <h3 className="t-h3 text-[1.15rem] text-brun">{offer.name}</h3>
            <p className="mt-1 text-[0.82rem] text-brun-logo">{offer.promise}</p>
            <p className="mt-5">
              {price ? (
                <>
                  <span className="text-[1.6rem] font-semibold tracking-[-0.02em] text-brun">{price.amount}</span>
                  <span className="t-note"> {price.per}</span>
                </>
              ) : (
                <span className="text-[0.95rem] font-semibold text-brun">Tarif communiqué sur demande</span>
              )}
            </p>
            <ul className="mt-4 space-y-2">
              {offer.included.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[0.84rem] text-brun">
                  <Check />
                  {item}
                </li>
              ))}
            </ul>
            {offer.conditions && <p className="t-note mt-4">{offer.conditions}</p>}
            <div className="mt-6">
              <CtaButton placement="offre" withNote className="w-full sm:w-auto" />
            </div>
          </div>
        </article>
      </Wrap>
    </section>
  );
}

/* 9. FAQ. */
export function Faq() {
  return (
    <section aria-labelledby="faq-titre" className="py-14 sm:py-20">
      <Wrap className="max-w-[760px]">
        <h2 id="faq-titre" data-reveal className="t-h2 text-brun">
          Vos questions avant de faire votre demande
        </h2>
        <div className="mt-6 divide-y divide-sable border-y border-sable">
          {faq.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-5 py-3 text-[0.88rem] font-semibold text-brun">
                {item.q}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brun/20 transition-transform duration-500 group-open:rotate-45" aria-hidden="true">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M6 1v10M1 6h10" />
                  </svg>
                </span>
              </summary>
              <p className="pb-4 pr-10 text-[0.84rem] text-brun-logo">{item.a}</p>
            </details>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

/* 10. Dernier appel. */
export function FinalCta() {
  return (
    <section
      aria-labelledby="final-titre"
      className="motif bg-olive py-14 text-creme [--motif-color:var(--color-creme)] [--motif-opacity:0.12] sm:py-20"
    >
      <Wrap className="flex flex-col items-center text-center">
        <h2 id="final-titre" className="t-h2 max-w-[22ch]">
          {finalCta.title}
        </h2>
        <ul className="mt-5 flex flex-col gap-2 text-[0.84rem] sm:flex-row sm:gap-6">
          {finalCta.bullets.map((b) => (
            <li key={b} className="flex items-center justify-center gap-2">
              <span aria-hidden="true">✓</span>
              {b}
            </li>
          ))}
        </ul>
        <a
          href="#demande"
          data-cta="final"
          className="mt-7 inline-flex min-h-[46px] items-center gap-2 rounded-full bg-creme px-6 text-[0.82rem] font-semibold text-brun transition-colors hover:bg-white"
        >
          {offer.cta}
          <span aria-hidden="true">→</span>
        </a>
        <p className="mt-2 text-[0.69rem] text-creme/80">{reassurance}</p>
      </Wrap>
    </section>
  );
}
