"use client";

import Image from "next/image";

export function HeroBackground() {
  return (
    <div className="hero-bg pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <Image
        src="/images/hero-bg.jpg"
        alt=""
        fill
        priority
        quality={75}
        sizes="100vw"
        className="hero-bg-image object-cover object-[center_40%]"
      />
      <div className="hero-bg-fabric-dim" />
      <div className="hero-bg-overlay" />
      <div className="hero-bg-vignette" />
      <div className="hero-bg-bottom-blend" />
    </div>
  );
}
