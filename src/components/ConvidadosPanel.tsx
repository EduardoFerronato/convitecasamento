"use client";

import type { ComponentType, FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Gift,
  Loader2,
  Lock,
  LogOut,
  RefreshCw,
  Trash2,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";
import type { RSVPRecord } from "@/app/api/rsvp/route";
import type { GiftReservation } from "@/app/api/gifts/route";
import { weddingConfig } from "@/config/wedding";
import { SiteBackground } from "@/components/ui/WeddingUI";

const STORAGE_KEY = "rsvp-admin-key";
type Tab = "rsvp" | "gifts";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function isPlaceholderEmail(email: string) {
  return email.endsWith("@rsvp.local");
}

function GuestTable({
  records,
  emptyMessage,
}: {
  records: RSVPRecord[];
  emptyMessage: string;
}) {
  if (records.length === 0) {
    return <p className="py-8 text-center text-sm text-silver">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-silver">
            <th className="font-sans-ui pb-3 pr-4 text-[10px] tracking-[0.14em]">Nome</th>
            <th className="font-sans-ui pb-3 pr-4 text-[10px] tracking-[0.14em]">Contato</th>
            <th className="font-sans-ui pb-3 pr-4 text-[10px] tracking-[0.14em]">Pessoas</th>
            <th className="font-sans-ui pb-3 pr-4 text-[10px] tracking-[0.14em]">Mensagem</th>
            <th className="font-sans-ui pb-3 text-[10px] tracking-[0.14em]">Enviado em</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="border-b border-white/5 text-white/90">
              <td className="py-3.5 pr-4 align-top font-medium">{record.name}</td>
              <td className="py-3.5 pr-4 align-top text-silver">
                {!isPlaceholderEmail(record.email) ? <div>{record.email}</div> : null}
                {record.phone ? (
                  <div className={`text-xs text-silver-muted ${!isPlaceholderEmail(record.email) ? "mt-0.5" : ""}`}>
                    {record.phone}
                  </div>
                ) : isPlaceholderEmail(record.email) ? (
                  <span>—</span>
                ) : null}
              </td>
              <td className="py-3.5 pr-4 align-top">{record.guests}</td>
              <td className="max-w-[200px] py-3.5 pr-4 align-top text-silver">
                {record.message || "—"}
              </td>
              <td className="py-3.5 align-top text-xs whitespace-nowrap text-silver-muted">
                {formatDate(record.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
}) {
  return (
    <div className="ref-card p-5">
      <div className="mb-3 flex items-center gap-2 text-silver">
        <Icon className="h-4 w-4" strokeWidth={1.5} />
        <span className="font-sans-ui text-[10px] tracking-[0.14em]">{label}</span>
      </div>
      <p className="font-display text-3xl text-white">{value}</p>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-sans-ui border-b-2 px-1 pb-3 text-[10px] tracking-[0.16em] transition-colors ${
        active
          ? "border-white text-white"
          : "border-transparent text-silver hover:text-white/80"
      }`}
    >
      {children}
    </button>
  );
}

export function ConvidadosPanel() {
  const [adminKey, setAdminKey] = useState("");
  const [inputKey, setInputKey] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("rsvp");
  const [records, setRecords] = useState<RSVPRecord[]>([]);
  const [giftReservations, setGiftReservations] = useState<GiftReservation[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [removingGift, setRemovingGift] = useState<string | null>(null);

  const fetchGiftReservations = useCallback(async () => {
    const res = await fetch("/api/gifts");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao carregar presentes.");
    setGiftReservations(data as GiftReservation[]);
  }, []);

  const fetchRecords = useCallback(async (key: string) => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const [rsvpRes] = await Promise.all([
        fetch("/api/rsvp", { headers: { "x-admin-key": key } }),
        fetchGiftReservations(),
      ]);
      const data = await rsvpRes.json();
      if (!rsvpRes.ok) throw new Error(data.error || "Não foi possível carregar.");
      setRecords(data as RSVPRecord[]);
      setAdminKey(key);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Erro desconhecido");
    }
  }, [fetchGiftReservations]);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      queueMicrotask(() => {
        void fetchRecords(saved);
      });
    }
  }, [fetchRecords]);

  function handleLogin(e: FormEvent) {
    e.preventDefault();
    const key = inputKey.trim();
    if (!key) return;
    sessionStorage.setItem(STORAGE_KEY, key);
    setAdminKey(key);
    fetchRecords(key);
  }

  function handleLogout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setAdminKey("");
    setInputKey("");
    setRecords([]);
    setGiftReservations([]);
    setStatus("idle");
    setErrorMessage("");
    setActiveTab("rsvp");
  }

  async function handleUnreserve(giftName: string) {
    if (!adminKey || removingGift) return;
    if (!confirm(`Remover a reserva de "${giftName}"?`)) return;

    setRemovingGift(giftName);
    try {
      const res = await fetch("/api/gifts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ giftName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao remover reserva.");
      await fetchGiftReservations();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao remover reserva.");
    } finally {
      setRemovingGift(null);
    }
  }

  const confirmed = records.filter((r) => r.attending === "yes");
  const declined = records.filter((r) => r.attending === "no");
  const totalGuests = confirmed.reduce((sum, r) => sum + r.guests, 0);
  const reservationMap = new Map(giftReservations.map((r) => [r.giftName, r]));
  const totalGifts = weddingConfig.gifts.items.length;
  const reservedCount = giftReservations.length;

  const showLogin =
    !adminKey || status === "idle" || (status === "error" && records.length === 0);

  return (
    <main className="relative min-h-[100dvh] bg-night">
      <SiteBackground />
      <div className="relative z-10 mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2 text-xs text-silver transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
              Voltar ao site
            </Link>
            <h1 className="font-display text-3xl text-white md:text-4xl">Painel</h1>
            <p className="mt-2 text-sm text-silver">Confirmações e lista de presentes</p>
          </div>

          {adminKey && status === "ready" ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fetchRecords(adminKey)}
                className="ref-card inline-flex items-center gap-2 px-4 py-2.5 text-xs text-silver transition-colors hover:text-white"
              >
                <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.5} />
                Atualizar
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="ref-card inline-flex items-center gap-2 px-4 py-2.5 text-xs text-silver transition-colors hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
                Sair
              </button>
            </div>
          ) : null}
        </div>

        {showLogin ? (
          <div className="mx-auto max-w-md">
            <form onSubmit={handleLogin} className="ref-card p-8">
              <div className="mb-6 flex items-center gap-3">
                <Lock className="h-5 w-5 text-silver" strokeWidth={1.5} />
                <div>
                  <h2 className="font-display text-xl text-white">Acesso restrito</h2>
                  <p className="mt-1 text-xs text-silver">
                    Use a senha definida em RSVP_ADMIN_KEY na Vercel.
                  </p>
                </div>
              </div>

              <label
                htmlFor="admin-key"
                className="font-sans-ui mb-2 block text-[11px] tracking-[0.14em] text-white/90"
              >
                Senha de admin
              </label>
              <input
                id="admin-key"
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="ref-input mb-4"
                autoComplete="current-password"
                placeholder="Digite a senha"
              />

              {errorMessage ? (
                <p className="mb-4 text-xs text-red-400">{errorMessage}</p>
              ) : null}

              <button
                type="submit"
                className="font-sans-ui w-full bg-white py-3.5 text-[10px] tracking-[0.22em] text-night transition-colors hover:bg-white/90"
              >
                Entrar
              </button>
            </form>
          </div>
        ) : status === "loading" ? (
          <div className="flex flex-col items-center justify-center py-24 text-silver">
            <Loader2 className="mb-3 h-8 w-8 animate-spin" strokeWidth={1.5} />
            <p className="text-sm">Carregando...</p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex gap-6 border-b border-white/10">
              <TabButton active={activeTab === "rsvp"} onClick={() => setActiveTab("rsvp")}>
                Confirmações
              </TabButton>
              <TabButton active={activeTab === "gifts"} onClick={() => setActiveTab("gifts")}>
                Presentes
              </TabButton>
            </div>

            {activeTab === "rsvp" ? (
              <>
                <div className="mb-10 grid gap-4 sm:grid-cols-3">
                  <StatCard label="Confirmados" value={confirmed.length} icon={UserCheck} />
                  <StatCard label="Total de pessoas" value={totalGuests} icon={Users} />
                  <StatCard label="Não comparecerão" value={declined.length} icon={UserX} />
                </div>

                <section className="mb-10">
                  <h2 className="font-display mb-4 text-xl text-white">
                    Confirmados ({confirmed.length})
                  </h2>
                  <div className="ref-card p-4 md:p-6">
                    <GuestTable records={confirmed} emptyMessage="Nenhuma confirmação ainda." />
                  </div>
                </section>

                <section>
                  <h2 className="font-display mb-4 text-xl text-white">
                    Não comparecerão ({declined.length})
                  </h2>
                  <div className="ref-card p-4 md:p-6">
                    <GuestTable
                      records={declined}
                      emptyMessage="Ninguém informou que não irá."
                    />
                  </div>
                </section>
              </>
            ) : (
              <>
                <div className="mb-10 grid gap-4 sm:grid-cols-3">
                  <StatCard label="Total de presentes" value={totalGifts} icon={Gift} />
                  <StatCard label="Reservados" value={reservedCount} icon={Gift} />
                  <StatCard
                    label="Disponíveis"
                    value={totalGifts - reservedCount}
                    icon={Gift}
                  />
                </div>

                <div className="ref-card overflow-x-auto p-4 md:p-6">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-silver">
                        <th className="font-sans-ui pb-3 pr-4 text-[10px] tracking-[0.14em]">
                          Presente
                        </th>
                        <th className="font-sans-ui pb-3 pr-4 text-[10px] tracking-[0.14em]">
                          Categoria
                        </th>
                        <th className="font-sans-ui pb-3 pr-4 text-[10px] tracking-[0.14em]">
                          Preço
                        </th>
                        <th className="font-sans-ui pb-3 pr-4 text-[10px] tracking-[0.14em]">
                          Status
                        </th>
                        <th className="font-sans-ui pb-3 pr-4 text-[10px] tracking-[0.14em]">
                          Reservado em
                        </th>
                        <th className="font-sans-ui pb-3 text-[10px] tracking-[0.14em]">
                          Ação
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {weddingConfig.gifts.items.map((item) => {
                        const reservation = reservationMap.get(item.name);
                        const isReserved = Boolean(reservation);
                        const isRemoving = removingGift === item.name;

                        return (
                          <tr key={item.name} className="border-b border-white/5 text-white/90">
                            <td className="py-3.5 pr-4 font-medium">{item.name}</td>
                            <td className="py-3.5 pr-4 text-silver">{item.category}</td>
                            <td className="py-3.5 pr-4 text-silver">{item.price}</td>
                            <td className="py-3.5 pr-4">
                              <span
                                className={`font-sans-ui text-[9px] tracking-[0.12em] ${
                                  isReserved ? "text-silver-muted" : "text-white"
                                }`}
                              >
                                {isReserved ? "Reservado" : "Disponível"}
                              </span>
                            </td>
                            <td className="py-3.5 pr-4 text-xs text-silver-muted">
                              {reservation ? formatDate(reservation.reservedAt) : "—"}
                            </td>
                            <td className="py-3.5">
                              {isReserved ? (
                                <button
                                  type="button"
                                  onClick={() => handleUnreserve(item.name)}
                                  disabled={isRemoving}
                                  className="inline-flex items-center gap-1.5 text-xs text-red-400 transition-colors hover:text-red-300 disabled:opacity-50"
                                >
                                  {isRemoving ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                                  )}
                                  Remover reserva
                                </button>
                              ) : (
                                <span className="text-xs text-silver-muted">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <p className="mt-6 text-center text-xs text-silver-muted">
                  {weddingConfig.gifts.honeymoon.title} é contribuição aberta (valor livre) e não
                  entra na lista de reservas.
                </p>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
