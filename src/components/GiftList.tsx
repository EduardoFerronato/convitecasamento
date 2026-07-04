"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Loader2 } from "lucide-react";
import { weddingConfig } from "@/config/wedding";
import type { GiftReservation } from "@/app/api/gifts/route";
import { SectionHeading } from "@/components/ui/WeddingUI";

function HoneymoonSection() {
  const { honeymoon } = weddingConfig.gifts;

  return (
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
        <a
          href={honeymoon.link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans-ui mt-8 inline-flex items-center justify-center border border-white/30 bg-transparent px-10 py-3.5 text-[10px] tracking-[0.22em] text-white transition-all hover:border-white hover:bg-white/5"
        >
          {honeymoon.buttonLabel}
        </a>
      </div>
    </motion.div>
  );
}

export function GiftList() {
  const { gifts } = weddingConfig;
  const [reservations, setReservations] = useState<GiftReservation[]>([]);
  const [loadingGift, setLoadingGift] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

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

  async function handleReserve(name: string, link: string) {
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
      window.open(link, "_blank", "noopener,noreferrer");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erro ao reservar.");
    } finally {
      setLoadingGift(null);
    }
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
                <button
                  type="button"
                  onClick={() => handleReserve(item.name, item.link)}
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
              </motion.div>
            );
          })}
        </div>

        <HoneymoonSection />
      </div>
    </section>
  );
}
