"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, Heart, Loader2, X } from "lucide-react";
import { weddingConfig } from "@/config/wedding";
import type { GiftReservation } from "@/app/api/gifts/route";
import { SectionHeading } from "@/components/ui/WeddingUI";

function HoneymoonPixModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { honeymoon } = weddingConfig.gifts;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(honeymoon.pixKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback para browsers sem clipboard API
      const input = document.createElement("textarea");
      input.value = honeymoon.pixKey;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pix-modal-title"
        >
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="absolute inset-0 bg-night/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            className="relative z-10 w-full max-w-sm border border-white/10 bg-night-card p-6 shadow-2xl md:p-8"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar modal"
              className="absolute top-4 right-4 text-silver transition-colors hover:text-white"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>

            <h3
              id="pix-modal-title"
              className="font-display pr-8 text-xl text-white md:text-2xl"
            >
              Contribuir via Pix
            </h3>
            <p className="mt-2 text-sm text-silver">
              Escaneie o QR Code ou copie a chave abaixo.
            </p>

            <div className="mx-auto mt-6 aspect-square w-full max-w-[220px] overflow-hidden rounded-sm bg-white p-3">
              <Image
                src={honeymoon.qrCodeImage}
                alt="QR Code Pix para lua de mel"
                width={220}
                height={220}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="mt-6">
              <p className="font-sans-ui mb-2 text-[10px] tracking-[0.14em] text-silver">
                {honeymoon.pixKeyLabel}
              </p>
              <p className="break-all rounded-sm border border-white/10 bg-night/50 px-3 py-2.5 text-sm text-white">
                {honeymoon.pixKey}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="font-sans-ui mt-5 inline-flex w-full items-center justify-center gap-2 bg-white py-3.5 text-[10px] tracking-[0.22em] text-night transition-colors hover:bg-white/90"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" strokeWidth={2} />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Copiar chave Pix
                </>
              )}
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function ConfirmReserveModal({
  open,
  giftName,
  isLoading,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  giftName: string | null;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && giftName ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-reserve-title"
        >
          <button
            type="button"
            aria-label="Fechar"
            onClick={onCancel}
            className="absolute inset-0 bg-night/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            className="relative z-10 w-full max-w-sm border border-white/10 bg-night-card p-6 shadow-2xl md:p-8"
          >
            <h3
              id="confirm-reserve-title"
              className="font-display text-xl text-white md:text-2xl"
            >
              Confirmar reserva
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-silver">
              Deseja confirmar a reserva do presente &ldquo;{giftName}&rdquo;?
            </p>

            <div className="mt-7 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="font-sans-ui inline-flex w-full items-center justify-center border border-white/20 py-3 text-[10px] tracking-[0.2em] text-silver transition-colors hover:border-white/40 hover:text-white disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className="font-sans-ui inline-flex w-full items-center justify-center gap-2 bg-white py-3 text-[10px] tracking-[0.22em] text-night transition-colors hover:bg-white/90 disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} />
                ) : null}
                Confirmar
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function HoneymoonSection() {
  const { honeymoon } = weddingConfig.gifts;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-14 border border-white/10 bg-night-card/80 p-6 md:mt-16 md:p-10"
      >
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-sans-ui text-[10px] tracking-[0.28em] text-silver">
            {honeymoon.label}
          </span>
          <div className="mt-4 flex justify-center">
            <Heart className="h-5 w-5 text-white/80" strokeWidth={1.5} />
          </div>
          <h3 className="font-display mt-4 text-2xl text-white md:text-3xl">
            {honeymoon.title}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-silver md:text-[15px]">
            {honeymoon.description}
          </p>
          <p className="font-sans-ui mt-6 text-[10px] tracking-[0.2em] text-silver-muted">
            Valor livre · quantas pessoas quiserem podem ajudar
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="font-sans-ui mt-8 inline-flex items-center justify-center border border-white/30 bg-transparent px-10 py-3.5 text-[10px] tracking-[0.22em] text-white transition-all hover:border-white hover:bg-white/5"
          >
            {honeymoon.buttonLabel}
          </button>
        </div>
      </motion.div>

      <HoneymoonPixModal
        key={modalOpen ? "open" : "closed"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

export function GiftList() {
  const { gifts } = weddingConfig;
  const [reservations, setReservations] = useState<GiftReservation[]>([]);
  const [loadingGift, setLoadingGift] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmGift, setConfirmGift] = useState<string | null>(null);

  const loadReservations = useCallback(async () => {
    try {
      const res = await fetch("/api/gifts");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao carregar presentes.");
      setReservations(data as GiftReservation[]);
    } catch {
      // Mantém lista anterior em caso de falha temporária
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void loadReservations();
    });
    const interval = setInterval(() => {
      void loadReservations();
    }, 30000);
    return () => clearInterval(interval);
  }, [loadReservations]);

  const reservedNames = new Set(reservations.map((r) => r.giftName));

  async function handleReserve(name: string) {
    if (reservedNames.has(name) || loadingGift) return;

    setLoadingGift(name);
    setErrorMessage("");

    try {
      const res = await fetch("/api/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ giftName: name }),
      });
      const data = await res.json();

      if (!res.ok) {
        await loadReservations();
        throw new Error(data.error || "Erro ao reservar.");
      }

      await loadReservations();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erro ao reservar.");
    } finally {
      setLoadingGift(null);
    }
  }

  function handleConfirmReserve() {
    if (!confirmGift) return;
    const name = confirmGift;
    setConfirmGift(null);
    void handleReserve(name);
  }

  return (
    <section id="presentes" className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label={gifts.label}
          title={gifts.title}
          subtitle={gifts.subtitle}
        />

        {errorMessage ? (
          <p className="-mt-8 mb-8 text-center text-xs text-red-400">{errorMessage}</p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gifts.items.map((item, index) => {
            const isReserved = reservedNames.has(item.name);
            const isLoading = loadingGift === item.name;

            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                className="ref-card flex flex-col p-5 md:p-6"
              >
                <span className="font-sans-ui mb-4 text-[9px] tracking-[0.2em] text-silver-muted">
                  {item.category}
                </span>
                <h3 className="font-display mb-auto text-base text-white md:text-lg">
                  {item.name}
                </h3>
                <p className="mt-4 mb-5 text-sm text-silver">{item.price}</p>
                <div className="flex flex-col gap-2">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans-ui inline-flex w-full items-center justify-center border border-white/20 py-2.5 text-[9px] tracking-[0.2em] text-silver transition-colors hover:border-white/40 hover:text-white"
                  >
                    Ver exemplo
                  </a>
                  <button
                    type="button"
                    onClick={() => setConfirmGift(item.name)}
                    disabled={isReserved || isLoading}
                    aria-label={
                      isReserved ? `${item.name} já reservado` : `Reservar ${item.name}`
                    }
                    className={`font-sans-ui inline-flex w-full items-center justify-center gap-2 py-2.5 text-[9px] tracking-[0.2em] transition-all ${
                      isReserved
                        ? "bg-white/5 text-silver-muted"
                        : "bg-white text-night hover:bg-white/90"
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} />
                    ) : null}
                    {isReserved ? "✓ Reservado" : isLoading ? "Reservando..." : "Reservar"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <HoneymoonSection />
      </div>

      <ConfirmReserveModal
        key={confirmGift ? `confirm-${confirmGift}` : "confirm-closed"}
        open={confirmGift !== null}
        giftName={confirmGift}
        isLoading={loadingGift === confirmGift}
        onConfirm={handleConfirmReserve}
        onCancel={() => setConfirmGift(null)}
      />
    </section>
  );
}
