"use client";

import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Info, Send, AlertCircle } from "lucide-react";
import { weddingConfig } from "@/config/wedding";
import { SectionHeading, PrimaryButton } from "@/components/ui/WeddingUI";

function formatDeadline(isoDate: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(isoDate));
}

function isDeadlinePassed(isoDate: string) {
  return Date.now() > new Date(isoDate).getTime();
}

export function RSVP() {
  const { rsvp, rsvpDeadline } = weddingConfig;
  const deadlinePassed = isDeadlinePassed(rsvpDeadline);
  const deadlineFormatted = formatDeadline(rsvpDeadline);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "0",
    dietary: "",
    message: "",
    attending: "yes" as "yes" | "no",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao enviar confirmação");
      setStatus("success");
      setForm({
        name: "",
        email: "",
        phone: "",
        guests: "0",
        dietary: "",
        message: "",
        attending: "yes",
      });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Erro desconhecido");
    }
  }

  return (
    <section id="rsvp" className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-3xl">
        <SectionHeading label={rsvp.label} title={rsvp.title} />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="-mt-6 mb-12 flex items-center justify-center gap-2 text-center text-sm text-silver"
        >
          <Info className="h-4 w-4 shrink-0 text-silver" strokeWidth={1.75} />
          {deadlinePassed ? (
            "Prazo para confirmação encerrado"
          ) : (
            <>
              Confirme até <strong className="font-medium text-white">{deadlineFormatted}</strong>
            </>
          )}
        </motion.p>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <CheckCircle2 className="mx-auto mb-5 h-10 w-10 text-white" strokeWidth={1} />
              <h3 className="font-display mb-2 text-2xl text-white">Confirmado!</h3>
              <p className="text-sm text-silver">{rsvp.successMessage}</p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-8 text-[10px] uppercase tracking-[0.2em] text-silver hover:text-white"
              >
                Enviar outra confirmação
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              <Field label="Você comparecerá?" htmlFor="attending">
                <div className="flex gap-4 pt-1">
                  {(["yes", "no"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      disabled={deadlinePassed}
                      onClick={() => setForm({ ...form, attending: option })}
                      className={`font-sans-ui flex-1 border-b-2 py-2.5 text-[10px] tracking-[0.12em] transition-all disabled:opacity-40 ${
                        form.attending === option
                          ? "border-white text-white"
                          : "border-white/45 text-silver hover:border-white/70 hover:text-white"
                      }`}
                    >
                      {option === "yes" ? "Sim, estarei lá" : "Não poderei ir"}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="grid gap-8 sm:grid-cols-2">
                <Field label="Nome completo" htmlFor="rsvp-name">
                  <input
                    id="rsvp-name"
                    type="text"
                    required
                    disabled={deadlinePassed}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="ref-input"
                    autoComplete="name"
                  />
                </Field>
                <Field label="Email" htmlFor="rsvp-email">
                  <input
                    id="rsvp-email"
                    type="email"
                    required
                    disabled={deadlinePassed}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="ref-input"
                    autoComplete="email"
                  />
                </Field>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <Field label="Telefone" htmlFor="rsvp-phone">
                  <input
                    id="rsvp-phone"
                    type="tel"
                    disabled={deadlinePassed}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="ref-input"
                    autoComplete="tel"
                  />
                </Field>
                {form.attending === "yes" && (
                  <Field label="Acompanhantes" htmlFor="rsvp-guests">
                    <select
                      id="rsvp-guests"
                      disabled={deadlinePassed}
                      value={form.guests}
                      onChange={(e) => setForm({ ...form, guests: e.target.value })}
                      className="ref-input cursor-pointer"
                    >
                      {[0, 1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={String(n)} className="bg-night">
                          {n}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}
              </div>

              <Field label="Restrições alimentares" htmlFor="rsvp-dietary">
                <input
                  id="rsvp-dietary"
                  type="text"
                  disabled={deadlinePassed}
                  value={form.dietary}
                  onChange={(e) => setForm({ ...form, dietary: e.target.value })}
                  className="ref-input"
                />
              </Field>

              <Field label="Mensagem para os noivos" htmlFor="rsvp-message">
                <textarea
                  id="rsvp-message"
                  rows={2}
                  disabled={deadlinePassed}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="ref-input resize-none"
                />
              </Field>

              {status === "error" && (
                <p className="flex items-center gap-2 text-xs text-red-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errorMessage}
                </p>
              )}

              <div className="flex justify-center pt-4">
                {status === "loading" ? (
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center gap-2 bg-white/25 px-8 py-3.5 text-[10px] uppercase tracking-[0.25em] text-white/80"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </button>
                ) : (
                  <PrimaryButton
                    type="submit"
                    disabled={deadlinePassed}
                    icon={<Send className="h-3.5 w-3.5" strokeWidth={1.5} />}
                  >
                    Confirmar Presença
                  </PrimaryButton>
                )}
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="font-sans-ui mb-2.5 block text-[11px] tracking-[0.14em] text-white/90"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
