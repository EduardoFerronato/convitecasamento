import Image from "next/image";
import { Heart } from "lucide-react";
import { weddingConfig } from "@/config/wedding";

function formatFooterDate(isoDate: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(new Date(isoDate))
    .toUpperCase();
}

export function Footer() {
  const { couple, weddingDate, events } = weddingConfig;
  const ceremony = events[0];
  const formattedDate = formatFooterDate(weddingDate);

  return (
    <footer className="px-5 pb-16 pt-8 md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-sm">
          <Image
            src="/images/venue-reception.jpg"
            alt="Local da recepção"
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-night/30" />
        </div>

        <div className="text-center">
          <p className="font-display text-3xl text-white md:text-4xl">
            {couple.bride} & {couple.groom}
          </p>
          <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-silver">
            {formattedDate} · {ceremony.location.toUpperCase()}, {ceremony.address.toUpperCase()}
          </p>
          <p className="mt-10 flex items-center justify-center gap-1.5 text-xs text-silver-muted">
            Feito com
            <Heart className="h-3 w-3 fill-white/40 text-white/40" strokeWidth={1.5} />
            para nosso grande dia
          </p>
        </div>
      </div>
    </footer>
  );
}
