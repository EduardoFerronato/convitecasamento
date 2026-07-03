"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { weddingConfig } from "@/config/wedding";
import { SectionHeading } from "@/components/ui/WeddingUI";

const STORAGE_KEY = "casamento-gifts-reserved";

const listeners = new Set<() => void>();
const serverSnapshot = new Set<string>();
let cachedKeys: string[] = [];
let cachedSnapshot = new Set<string>();

function emitReservedChange() {
  listeners.forEach((listener) => listener());
}

function subscribeReserved(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getReservedSnapshot(): Set<string> {
  if (typeof window === "undefined") return cachedSnapshot;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const keys: string[] = saved ? (JSON.parse(saved) as string[]) : [];
    if (
      keys.length === cachedKeys.length &&
      keys.every((key, index) => key === cachedKeys[index])
    ) {
      return cachedSnapshot;
    }
    cachedKeys = keys;
    cachedSnapshot = new Set(keys);
    return cachedSnapshot;
  } catch {
    if (cachedKeys.length === 0) return cachedSnapshot;
    cachedKeys = [];
    cachedSnapshot = new Set();
    return cachedSnapshot;
  }
}

export function GiftList() {
  const { gifts } = weddingConfig;
  const reserved = useSyncExternalStore(
    subscribeReserved,
    getReservedSnapshot,
    () => serverSnapshot
  );

  function toggleReserve(name: string, link: string, isReserved: boolean) {
    if (isReserved) return;
    const next = new Set(reserved);
    next.add(name);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    emitReservedChange();
    window.open(link, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="presentes" className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label={gifts.label}
          title={gifts.title}
          subtitle={gifts.subtitle}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gifts.items.map((item, index) => {
            const isReserved = reserved.has(item.name);
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
                  onClick={() => toggleReserve(item.name, item.link, isReserved)}
                  disabled={isReserved}
                  aria-label={isReserved ? `${item.name} já reservado` : `Reservar ${item.name}`}
                  className={`font-sans-ui w-full py-2.5 text-[9px] tracking-[0.2em] transition-all ${
                    isReserved
                      ? "bg-white/5 text-silver-muted"
                      : "bg-white text-night hover:bg-white/90"
                  }`}
                >
                  {isReserved ? "✓ Reservado" : "Reservar"}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
