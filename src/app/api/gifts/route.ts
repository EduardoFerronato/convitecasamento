import { NextRequest, NextResponse } from "next/server";
import { weddingConfig } from "@/config/wedding";
import { getSql } from "@/lib/db";

export interface GiftReservation {
  id: string;
  giftName: string;
  reservedAt: string;
}

const giftNames = new Set(weddingConfig.gifts.items.map((item) => item.name));

function isValidGiftName(name: unknown): name is string {
  return typeof name === "string" && giftNames.has(name.trim());
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

function checkAdminKey(request: NextRequest) {
  const adminKey = process.env.RSVP_ADMIN_KEY;
  if (!adminKey) {
    return process.env.NODE_ENV !== "production";
  }
  return request.headers.get("x-admin-key") === adminKey;
}

export async function GET() {
  try {
    const sql = getSql();
    const rows = await sql`
      SELECT
        id,
        gift_name AS "giftName",
        reserved_at AS "reservedAt"
      FROM gift_reservations
      ORDER BY reserved_at DESC
    `;
    return NextResponse.json(rows as GiftReservation[]);
  } catch (error) {
    if (isMissingTable(error)) {
      return NextResponse.json(
        {
          error:
            "Tabela gift_reservations não encontrada. Execute sql/gift_reservations.sql no Neon.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao carregar reservas de presentes." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { giftName } = body;

    if (!isValidGiftName(giftName)) {
      return NextResponse.json({ error: "Presente inválido." }, { status: 400 });
    }

    const name = giftName.trim();
    const id = crypto.randomUUID();
    const sql = getSql();

    await sql`
      INSERT INTO gift_reservations (id, gift_name)
      VALUES (${id}, ${name})
    `;

    return NextResponse.json({ success: true, id, giftName: name });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return NextResponse.json(
        { error: "Este presente já foi reservado." },
        { status: 409 }
      );
    }
    if (isMissingTable(error)) {
      return NextResponse.json(
        {
          error:
            "Tabela gift_reservations não encontrada. Execute sql/gift_reservations.sql no Neon.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao reservar presente." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!checkAdminKey(request)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { giftName } = body;

    if (!isValidGiftName(giftName)) {
      return NextResponse.json({ error: "Presente inválido." }, { status: 400 });
    }

    const sql = getSql();
    const rows = await sql`
      DELETE FROM gift_reservations
      WHERE gift_name = ${giftName.trim()}
      RETURNING id
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Este presente não está reservado." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (isMissingTable(error)) {
      return NextResponse.json(
        {
          error:
            "Tabela gift_reservations não encontrada. Execute sql/gift_reservations.sql no Neon.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao remover reserva." },
      { status: 500 }
    );
  }
}
