import type { ReactNode } from "react";
import { weddingConfig } from "@/config/wedding";

export function SiteBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-night-gradient" aria-hidden="true" />
  );
}

export function SectionHeading({
  label,
  title,
  subtitle,
  align = "center",
}: {
  label: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : "text-left"}`}>
      <p className="font-sans-ui text-[10px] tracking-[0.28em] text-silver">{label}</p>
      <h2 className="font-display mt-3 text-3xl font-normal text-white md:text-[2.75rem]">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-silver md:text-[15px]">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function PrimaryButton({
  href,
  onClick,
  type = "button",
  disabled,
  children,
  className = "",
  icon,
}: {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  const classes = `font-sans-ui inline-flex items-center justify-center gap-2.5 bg-white px-8 py-3.5 text-[10px] font-medium tracking-[0.22em] text-night transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40 ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {icon}
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {icon}
      {children}
    </button>
  );
}

export function ScrollIndicator() {
  return <div className="scroll-line mx-auto h-10 w-px bg-white/50" />;
}

export function WeddingFooterNote() {
  const { couple } = weddingConfig;
  return (
    <p className="text-center text-xs tracking-widest text-silver-muted/60">
      {couple.bride} & {couple.groom} · {couple.hashtag}
    </p>
  );
}
