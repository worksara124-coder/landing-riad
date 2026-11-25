"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { offer } from "@/content/offer";
import { reassurance } from "@/content/landing";
import {
  MESSAGE_MAX,
  departureFor,
  emptyValues,
  fields,
  isoDate,
  validate,
  type Errors,
  type Field,
  type Values,
} from "@/lib/demande";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "demo" } | { kind: "error"; message: string };

const dateFmt = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const formatDay = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return dateFmt.format(new Date(Date.UTC(y, m - 1, d)));
};

/**
 * Formulaire de demande intégré au hero (architecture art.nymorr.com) : court, sur la page,
 * départ calculé automatiquement, erreurs claires près des champs.
 */
export function DemandeForm({ enabled }: { enabled: boolean }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>(emptyValues);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [today, setToday] = useState("");
  const [website, setWebsite] = useState(""); // champ piège anti-robots

  useEffect(() => setToday(isoDate(new Date())), []);

  const departure = departureFor(values.arrival);

  function update(field: Field, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (status.kind === "demo" || status.kind === "error") setStatus({ kind: "idle" });
    if (touched[field] || errors[field]) setErrors((prev) => ({ ...prev, [field]: validate(next, today)[field] }));
  }

  function blur(field: Field, e: React.FocusEvent) {
    // Pas d'erreur au simple passage dans un champ vide, ni juste avant l'envoi.
    if ((e.relatedTarget as HTMLElement | null)?.getAttribute("type") === "submit") return;
    if (!values[field].trim() && !errors[field]) return;
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validate(values, today)[field] }));
  }

  function step(delta: number) {
    const n = Number.parseInt(values.guests, 10);
    const max = offer.capacity ?? 20;
    setTouched((t) => ({ ...t, guests: true }));
    update("guests", String(Math.min(max, Math.max(1, (Number.isFinite(n) ? n : 0) + delta))));
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "sending") return;
    const all = validate(values, today);
    setErrors(all);
    setTouched(Object.fromEntries(fields.map((f) => [f, true])));
    const first = fields.find((f) => all[f]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name='${first}']`)?.focus();
      return;
    }
    // Aucun service configuré : rien n'est transmis, et on le dit.
    if (!enabled) {
      setStatus({ kind: "demo" });
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/demande", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website }),
      });
      if (res.ok) {
        setStatus({ kind: "sent" });
        return;
      }
      const data = (await res.json().catch(() => null)) as { code?: string; errors?: Errors } | null;
      if (data?.code === "invalid" && data.errors) {
        setErrors(data.errors);
        setStatus({ kind: "error", message: "Certaines informations sont à corriger." });
      } else if (data?.code === "not_configured") setStatus({ kind: "demo" });
      else setStatus({ kind: "error", message: "L’envoi n’a pas abouti. Veuillez réessayer dans un instant." });
    } catch {
      setStatus({ kind: "error", message: "Connexion impossible. Vérifiez votre réseau puis réessayez." });
    }
  }

  const err = (f: Field) => (touched[f] || status.kind !== "idle" ? errors[f] : undefined);

  return (
    <div
      id="demande"
      className="rounded-[20px] border border-sable bg-[#fbf8f2] p-5 shadow-[0_24px_60px_-40px_rgb(53_39_31/0.55)] sm:p-6"
    >
      <p className="t-h3 text-brun">Demander mon escapade</p>
      <p className="t-note mt-1">
        {offer.room.name} · {offer.nights} nuits{departure && values.arrival ? ` · du ${formatDay(values.arrival)} au ${formatDay(departure)}` : ""}
      </p>

          {status.kind === "sent" ? (
            <div role="status" className="mt-5 rounded-[16px] bg-olive/10 px-5 py-6">
              <p className="t-h3 text-brun">Merci, votre demande a bien été transmise.</p>
              <p className="mt-2 text-brun-logo">
                Il s’agit d’une demande et non d’une réservation confirmée : le riad reviendra vers vous pour confirmer les
                disponibilités.
              </p>
            </div>
          ) : (
            <form ref={formRef} noValidate onSubmit={submit} className="mt-4 grid gap-3.5 sm:grid-cols-2">
              <Field label="Date d’arrivée" field="arrival" error={err("arrival")}>
                {(a) => (
                  <input
                    {...a}
                    type="date"
                    min={today || undefined}
                    value={values.arrival}
                    onChange={(e) => update("arrival", e.target.value)}
                    onBlur={(e) => blur("arrival", e)}
                    className="field"
                    required
                  />
                )}
              </Field>

              <div className="flex flex-col">
                <span className="mb-1 pl-1 text-[0.75rem] font-medium text-brun" id="depart-label">
                  Date de départ
                </span>
                <p
                  aria-labelledby="depart-label"
                  className="flex min-h-[44px] items-center rounded-full border border-dashed border-sable px-4 text-[0.82rem] text-brun-logo"
                >
                  {departure ? formatDay(departure) : `Arrivée + ${offer.nights} nuits`}
                </p>
              </div>

              <Field
                label="Nombre de voyageurs"
                field="guests"
                error={err("guests")}
                hint={offer.capacity != null ? `Jusqu’à ${offer.capacity} voyageurs` : undefined}
                className="sm:col-span-2"
              >
                {(a) => (
                  <div
                    className={`flex h-[44px] w-full max-w-[11.5rem] items-center justify-between rounded-full px-1.5 ${
                      err("guests") ? "bg-terracotta/10 ring-1 ring-terracotta-fonce" : "bg-[#efe7da]"
                    }`}
                  >
                    <StepButton label="Retirer un voyageur" onClick={() => step(-1)}>
                      <path d="M4 9h10" />
                    </StepButton>
                    <input
                      {...a}
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={offer.capacity ?? undefined}
                      step={1}
                      value={values.guests}
                      onChange={(e) => update("guests", e.target.value)}
                      onBlur={(e) => blur("guests", e)}
                      className="w-14 appearance-none bg-transparent text-center text-base font-medium text-brun outline-none [-moz-appearance:textfield] focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-terracotta-fonce [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      required
                    />
                    <StepButton label="Ajouter un voyageur" onClick={() => step(1)}>
                      <path d="M4 9h10M9 4v10" />
                    </StepButton>
                  </div>
                )}
              </Field>

              <Field label="Nom complet" field="fullName" error={err("fullName")} className="sm:col-span-2">
                {(a) => (
                  <input
                    {...a}
                    type="text"
                    autoComplete="name"
                    value={values.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    onBlur={(e) => blur("fullName", e)}
                    className="field"
                    required
                  />
                )}
              </Field>
              <Field label="Téléphone" field="phone" error={err("phone")}>
                {(a) => (
                  <input
                    {...a}
                    type="tel"
                    autoComplete="tel"
                    value={values.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    onBlur={(e) => blur("phone", e)}
                    className="field"
                    required
                  />
                )}
              </Field>
              <Field label="E-mail" field="email" error={err("email")}>
                {(a) => (
                  <input
                    {...a}
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={(e) => update("email", e.target.value)}
                    onBlur={(e) => blur("email", e)}
                    className="field"
                    required
                  />
                )}
              </Field>

              <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                <label>
                  Site web
                  <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </label>
              </div>

              <div className="sm:col-span-2" aria-live="polite">
                {status.kind === "demo" && (
                  <p role="status" className="rounded-[12px] bg-olive/10 px-3.5 py-2.5 text-[0.78rem] text-brun">
                    Votre demande est complète, mais elle <strong className="font-semibold">n’a pas été envoyée</strong> : le
                    service d’envoi n’est pas encore activé sur ce site.
                  </p>
                )}
                {status.kind === "error" && (
                  <p role="alert" className="rounded-[12px] bg-terracotta/10 px-3.5 py-2.5 text-[0.78rem] text-brun">
                    {status.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <button type="submit" disabled={status.kind === "sending"} data-cta="formulaire" className="cta w-full disabled:cursor-wait disabled:opacity-70">
                  {status.kind === "sending" ? "Envoi en cours…" : offer.cta}
                  <span className="cta-arrow" aria-hidden="true">
                    →
                  </span>
                </button>
                <p className="t-note mt-2 text-center">{reassurance}</p>
              </div>
            </form>
      )}
    </div>
  );
}

interface A11y {
  id: string;
  name: Field;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
}

function Field({
  label,
  field,
  error,
  hint,
  optional,
  className = "",
  children,
}: {
  label: string;
  field: Field;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: (a: A11y) => ReactNode;
}) {
  const id = `demande-${field}`;
  const describedBy = [hint && !error ? `${id}-aide` : "", error ? `${id}-erreur` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={id} className="mb-1 pl-1 text-[0.75rem] font-medium text-brun">
        {label}
        {optional && <span className="font-normal text-brun-logo"> (facultatif)</span>}
      </label>
      {children({ id, name: field, "aria-invalid": Boolean(error), "aria-describedby": describedBy })}
      {hint && !error && (
        <p id={`${id}-aide`} className="mt-1 pl-1 text-[0.7rem] text-brun-logo">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-erreur`} className="mt-1 pl-1 text-[0.72rem] font-medium text-terracotta-fonce">
          {error}
        </p>
      )}
    </div>
  );
}

function StepButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-creme text-brun shadow-[0_1px_3px_rgb(53_39_31/0.12)] hover:bg-white"
    >
      <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        {children}
      </svg>
    </button>
  );
}
