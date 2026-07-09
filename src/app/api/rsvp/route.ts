import { NextRequest, NextResponse } from "next/server";
import { weddingConfig } from "@/config/wedding";
import { getSql } from "@/lib/db";

export interface RSVPRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  attending: "yes" | "no";
  guests: number;
  message: string;
  createdAt: string;
}

function isDeadlinePassed() {
  return Date.now() > new Date(weddingConfig.rsvpDeadline).getTime();
}

function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "23505"
  );
}

function isMissingTable(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "42P01"
  );
}

export async function POST(request: NextRequest) {
  try {
    if (isDeadlinePassed()) {
      return NextResponse.json(
        { error: "O prazo para confirmação de presença já encerrou." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      attending = "yes",
      guests,
      message,
    } = body;

    if (attending === "no") {
      if (!name?.trim()) {
        return NextResponse.json(
          { error: "Nome é obrigatório." },
          { status: 400 }
        );
      }
    } else if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Nome e e-mail são obrigatórios." },
        { status: 400 }
      );
    }

    if (attending !== "no" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
    }

    const additionalGuests = Math.min(Math.max(Number(guests) || 0, 0), 10);
    const guestCount = attending === "yes" ? 1 + additionalGuests : 0;
    const id = crypto.randomUUID();
    const normalizedEmail =
      attending === "no"
        ? `ausente-${id}@rsvp.local`
        : email.trim().toLowerCase();
    const sql = getSql();

    await sql`
      INSERT INTO rsvps (id, name, email, phone, attending, guests, message)
      VALUES (
        ${id},
        ${name.trim()},
        ${normalizedEmail},
        ${(phone || "").trim()},
        ${attending === "no" ? "no" : "yes"},
        ${guestCount},
        ${(message || "").trim()}
      )
    `;

    return NextResponse.json({ success: true, id });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return NextResponse.json(
        { error: "Este e-mail já confirmou presença." },
        { status: 409 }
      );
    }
    if (isMissingTable(error)) {
      return NextResponse.json(
        {
          error:
            "Tabela rsvps não encontrada. Execute sql/schema.sql no banco da Vercel.",
        },
        { status: 503 }
      );
    }
    if (
      error instanceof Error &&
      error.message.includes("POSTGRES_URL não configurada")
    ) {
      return NextResponse.json(
        {
          error:
            "Banco de dados não configurado. Adicione Postgres em Vercel → Storage.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Erro interno ao salvar confirmação." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const adminKey = process.env.RSVP_ADMIN_KEY;
  if (adminKey) {
    const provided = request.headers.get("x-admin-key");
    if (provided !== adminKey) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const sql = getSql();
    const rows = await sql`
      SELECT
        id,
        name,
        email,
        phone,
        attending,
        guests,
        message,
        created_at AS "createdAt"
      FROM rsvps
      ORDER BY created_at DESC
    `;

    return NextResponse.json(rows as RSVPRecord[]);
  } catch (error) {
    if (isMissingTable(error)) {
      return NextResponse.json(
        {
          error:
            "Tabela rsvps não encontrada. Execute sql/schema.sql no banco da Vercel.",
        },
        { status: 503 }
      );
    }
    if (
      error instanceof Error &&
      error.message.includes("POSTGRES_URL não configurada")
    ) {
      return NextResponse.json(
        {
          error:
            "Banco de dados não configurado. Adicione Postgres em Vercel → Storage.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao carregar confirmações." },
      { status: 500 }
    );
  }
}
