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
    return <div className="min-h-[100dvh] bg-[#eceae6]" />;
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
  const leftFlapRef = useRef<HTMLDivElement>(null);
  const rightFlapRef = useRef<HTMLDivElement>(null);
  const sealWrapRef = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function openEnvelope() {
    if (animatingRef.current) return;
    animatingRef.current = true;

    const sealWrap = sealWrapRef.current;
    const topFlap = topFlapRef.current;
    const bottomFlap = bottomFlapRef.current;
    const leftFlap = leftFlapRef.current;
    const rightFlap = rightFlapRef.current;
    const overlay = overlayRef.current;

    if (!sealWrap || !topFlap || !bottomFlap || !leftFlap || !rightFlap || !overlay) return;

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
      .to(topFlap, { y: "-100%", duration: 1.05, ease: "power3.inOut" }, "-=0.15")
      .to(bottomFlap, { y: "100%", duration: 1.05, ease: "power3.inOut" }, "<")
      .to(leftFlap, { x: "-100%", duration: 1.05, ease: "power3.inOut" }, "<")
      .to(rightFlap, { x: "100%", duration: 1.05, ease: "power3.inOut" }, "<")
      .to(overlay, { opacity: 0, duration: 0.65, ease: "power2.out" }, "-=0.5");
  }

  const brideInitial = weddingConfig.couple.bride.charAt(0);
  const groomInitial = weddingConfig.couple.groom.charAt(0);

  return (
    <div
      ref={overlayRef}
      className="envelope-overlay fixed inset-0 z-[200] overflow-hidden bg-[#eceae6]"
      role="dialog"
      aria-label="Convite de casamento"
    >
      <div className="envelope-paper" aria-hidden="true" />

      <div ref={leftFlapRef} className="envelope-flap envelope-flap-left" aria-hidden="true" />
      <div ref={rightFlapRef} className="envelope-flap envelope-flap-right" aria-hidden="true" />
      <div ref={topFlapRef} className="envelope-flap envelope-flap-top" aria-hidden="true" />
      <div
        ref={bottomFlapRef}
        className="envelope-flap envelope-flap-bottom"
        aria-hidden="true"
      />

      <div className="envelope-crease" aria-hidden="true" />

      <div className="envelope-seal-stage">
        <div ref={sealWrapRef} className="envelope-seal-wrap">
          <button
            type="button"
            onClick={openEnvelope}
            aria-label="Clique para abrir o convite"
            className="envelope-seal"
          >
            <span className="envelope-seal-wax" aria-hidden="true" />
            <svg className="envelope-seal-ring" viewBox="0 0 136 136" aria-hidden="true">
              <defs>
                <path
                  id="seal-text-path"
                  d="M 68,68 m -48,0 a 48,48 0 1,1 96,0 a 48,48 0 1,1 -96,0"
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
