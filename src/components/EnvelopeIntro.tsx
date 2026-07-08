"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { weddingConfig } from "@/config/wedding";

const STORAGE_KEY = "casamento-envelope-opened";

export function EnvelopeGate({ children }: { children: React.ReactNode }) {
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const opened = sessionStorage.getItem(STORAGE_KEY) === "true";
    queueMicrotask(() => {
      setShowEnvelope(!opened);
      setReady(true);
    });
  }, []);

  const handleOpen = useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setShowEnvelope(false);
  }, []);

  if (!ready) {
    return <div className="min-h-[100dvh] bg-night" />;
  }

  return (
    <>
      {children}
      {showEnvelope ? <EnvelopeIntro onOpen={handleOpen} /> : null}
    </>
  );
}

function EnvelopeIntro({ onOpen }: { onOpen: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const topFlapRef = useRef<HTMLDivElement>(null);
  const bottomFlapRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLButtonElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const animatingRef = useRef(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const seal = sealRef.current;
    if (!seal) return;

    gsap.to(seal, {
      scale: 1.04,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  function openEnvelope() {
    if (animatingRef.current) return;
    animatingRef.current = true;

    const seal = sealRef.current;
    const topFlap = topFlapRef.current;
    const bottomFlap = bottomFlapRef.current;
    const overlay = overlayRef.current;
    const hint = hintRef.current;

    if (!seal || !topFlap || !bottomFlap || !overlay) return;

    gsap.killTweensOf(seal);

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        onOpen();
      },
    });

    if (hint) {
      tl.to(hint, { opacity: 0, duration: 0.2 }, 0);
    }

    tl.to(seal, {
      scale: 0,
      opacity: 0,
      duration: 0.45,
      ease: "power2.in",
    })
      .to(
        topFlap,
        {
          y: "-100%",
          duration: 0.85,
          ease: "power3.inOut",
        },
        "-=0.15"
      )
      .to(
        bottomFlap,
        {
          y: "100%",
          duration: 0.85,
          ease: "power3.inOut",
        },
        "<"
      )
      .to(
        overlay,
        {
          opacity: 0,
          duration: 0.55,
          ease: "power2.out",
        },
        "-=0.35"
      );
  }

  const initials = `${weddingConfig.couple.bride.charAt(0)}&${weddingConfig.couple.groom.charAt(0)}`;

  return (
    <div
      ref={overlayRef}
      className="envelope-overlay fixed inset-0 z-[200] flex items-center justify-center bg-night"
      aria-hidden={false}
    >
      <div className="envelope-scene flex flex-col items-center">
        <p
          ref={hintRef}
          className="font-sans-ui mb-10 text-[10px] tracking-[0.28em] text-silver"
        >
          Toque no lacre para abrir
        </p>

        <div className="envelope">
          <div className="envelope-body">
            <span className="font-display text-lg text-night/40 md:text-xl">
              {weddingConfig.couple.bride} & {weddingConfig.couple.groom}
            </span>
          </div>

          <div ref={bottomFlapRef} className="envelope-flap-bottom" aria-hidden="true" />
          <div ref={topFlapRef} className="envelope-flap-top" aria-hidden="true" />

          <button
            ref={sealRef}
            type="button"
            onClick={openEnvelope}
            aria-label="Abrir convite — toque no lacre de cera"
            className="envelope-seal"
          >
            <span className="font-display text-sm text-white/95 md:text-base">{initials}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
