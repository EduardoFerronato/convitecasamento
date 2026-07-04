import type { Metadata } from "next";
import { ConvidadosPanel } from "@/components/ConvidadosPanel";

export const metadata: Metadata = {
  title: "Convidados — Anna & Eduardo",
  robots: { index: false, follow: false },
};

export default function ConvidadosPage() {
  return <ConvidadosPanel />;
}
