"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { weddingConfig } from "@/config/wedding";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const difference = new Date(targetDate).getTime() - Date.now();
  if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center px-3 sm:px-6 md:px-8">
      <span
        suppressHydrationWarning
        className="font-display text-5xl font-normal text-white sm:text-6xl md:text-7xl"
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className="font-sans-ui mt-2 text-[9px] tracking-[0.3em] text-silver-muted sm:text-[10px]">
        {label}
      </span>
    </div>
  );
}

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const update = () => setTimeLeft(calculateTimeLeft(weddingConfig.weddingDate));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="contagem" className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-sans-ui mb-10 text-[10px] tracking-[0.28em] text-silver"
        >
          Contagem Regressiva
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center"
        >
          <TimeBlock value={timeLeft.days} label="Dias" />
          <TimeBlock value={timeLeft.hours} label="Horas" />
          <TimeBlock value={timeLeft.minutes} label="Min" />
          <TimeBlock value={timeLeft.seconds} label="Seg" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display mt-10 text-sm italic text-silver md:text-base"
        >
          {weddingConfig.countdown.phrase}
        </motion.p>
      </div>
    </section>
  );
}
