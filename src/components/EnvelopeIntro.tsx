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
    return <div className="min-h-[100dvh] bg-[#e8e6e2]" />;
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
  const sealWrapRef = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const sealWrap = sealWrapRef.current;
    if (!sealWrap) return;

    gsap.to(sealWrap, {
      scale: 1.03,
      duration: 1.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  function openEnvelope() {
    if (animatingRef.current) return;
    animatingRef.current = true;

    const sealWrap = sealWrapRef.current;
    const topFlap = topFlapRef.current;
    const bottomFlap = bottomFlapRef.current;
    const overlay = overlayRef.current;

    if (!sealWrap || !topFlap || !bottomFlap || !overlay) return;

    gsap.killTweensOf(sealWrap);

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        onOpen();
      },
    });

    tl.to(sealWrap, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
    })
      .to(
        topFlap,
        { y: "-100%", duration: 1, ease: "power3.inOut" },
        "-=0.2"
      )
      .to(
        bottomFlap,
        { y: "100%", duration: 1, ease: "power3.inOut" },
        "<"
      )
      .to(
        overlay,
        { opacity: 0, duration: 0.6, ease: "power2.out" },
        "-=0.45"
      );
  }

  const brideInitial = weddingConfig.couple.bride.charAt(0);
  const groomInitial = weddingConfig.couple.groom.charAt(0);

  return (
    <div
      ref={overlayRef}
      className="envelope-overlay fixed inset-0 z-[200] overflow-hidden bg-[#e8e6e2]"
      role="dialog"
      aria-label="Convite de casamento"
    >
      <div
        ref={topFlapRef}
        className="envelope-flap envelope-flap-top"
        aria-hidden="true"
      />
      <div
        ref={bottomFlapRef}
        className="envelope-flap envelope-flap-bottom"
        aria-hidden="true"
      />

      <div className="envelope-seal-stage">
        <div ref={sealWrapRef} className="envelope-seal-wrap">
        <button
          type="button"
          onClick={openEnvelope}
          aria-label="Clique para abrir o convite"
          className="envelope-seal"
        >
          <svg
            className="envelope-seal-ring"
            viewBox="0 0 120 120"
            aria-hidden="true"
          >
            <defs>
              <path
                id="seal-text-path"
                d="M 60,60 m -42,0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0"
              />
            </defs>
            <text className="envelope-seal-ring-text">
              <textPath href="#seal-text-path" startOffset="50%" textAnchor="middle">
                CLIQUE PARA ABRIR
              </textPath>
            </text>
          </svg>
          <span className="envelope-seal-initials font-display">
            {brideInitial}
            <span className="envelope-seal-divider" aria-hidden="true">
              |
            </span>
            {groomInitial}
          </span>
        </button>
        </div>
      </div>
    </div>
  );
}
