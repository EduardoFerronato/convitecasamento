"use client";

import type { ComponentType } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";
import { weddingConfig } from "@/config/wedding";
import { PrimaryButton, ScrollIndicator } from "@/components/ui/WeddingUI";
import { HeroBackground } from "@/components/HeroBackground";

function formatDateUpper(isoDate: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(new Date(isoDate))
    .toUpperCase();
}

export function Hero() {
  const { couple, weddingDate, invitation, events } = weddingConfig;
  const ceremony = events[0];
  const formattedDate = formatDateUpper(weddingDate);

  return (
    <section
      id="convite"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-5 pt-24 pb-10 md:px-8"
    >
      <HeroBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-sans-ui hero-readable mb-8 max-w-xs text-[10px] leading-relaxed tracking-[0.28em] text-silver sm:max-w-none sm:text-[11px]"
        >
          {invitation.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-10 flex flex-col items-center"
        >
          <h1 className="font-display text-[3rem] font-normal leading-none text-white sm:text-[3.5rem] md:text-[4.25rem]">
            {couple.bride}
          </h1>
          <span className="font-display my-2 text-base italic text-white/90 sm:my-2.5 sm:text-lg">&</span>
          <h1 className="font-display text-[3rem] font-normal leading-none text-white sm:text-[3.5rem] md:text-[4.25rem]">
            {couple.groom}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mb-10 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-0 hero-readable"
        >
          <DetailItem icon={Calendar} text={formattedDate} />
          <span className="ref-divider-v hidden sm:block sm:mx-4" />
          <DetailItem icon={Clock} text={ceremony.time} />
          <span className="ref-divider-v hidden sm:block sm:mx-4" />
          <DetailItem
            icon={MapPin}
            text={`${ceremony.location.toUpperCase()} — ${ceremony.address.toUpperCase()}`}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <PrimaryButton href="#rsvp">Confirmar Presença</PrimaryButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-14"
        >
          <ScrollIndicator />
        </motion.div>
      </div>
    </section>
  );
}

function DetailItem({
  icon: Icon,
  text,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 shrink-0 text-silver" strokeWidth={1.75} />
      <span className="font-sans-ui text-[10px] tracking-[0.14em] text-white sm:text-[11px]">
        {text}
      </span>
    </div>
  );
}
