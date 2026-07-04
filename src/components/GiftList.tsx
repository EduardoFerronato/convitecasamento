"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { weddingConfig } from "@/config/wedding";
import type { GiftReservation } from "@/app/api/gifts/route";
import { SectionHeading } from "@/components/ui/WeddingUI";

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
      </div>
    </section>
  );
}
