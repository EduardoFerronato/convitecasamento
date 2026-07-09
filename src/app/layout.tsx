import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Anna & Eduardo — Casamento",
  description:
    "Convite de casamento de Anna e Eduardo. Confirme sua presença e celebre conosco este dia especial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${montserrat.variable} h-full scroll-smooth`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full font-sans font-light antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
