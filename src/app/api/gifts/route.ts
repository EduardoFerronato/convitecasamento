import { NextRequest, NextResponse } from "next/server";
import { weddingConfig } from "@/config/wedding";
import {
  classifyGiftStoreError,
  listGiftReservations,
  removeGiftReservation,
  reserveGift,
} from "@/lib/gift-reservations";

export type { GiftReservation } from "@/lib/gift-reservations";

const giftNames = new Set(weddingConfig.gifts.items.map((item) => item.name));

function isValidGiftName(name: unknown): name is string {
  return typeof name === "string" && giftNames.has(name.trim());
}

function checkAdminKey(request: NextRequest) {
  const adminKey = process.env.RSVP_ADMIN_KEY;
  if (!adminKey) {
    return process.env.NODE_ENV !== "production";
  }
  return request.headers.get("x-admin-key") === adminKey;
}

function giftStoreErrorResponse(kind: ReturnType<typeof classifyGiftStoreError>) {
  if (kind === "missing-table") {
    return NextResponse.json(
      {
        error:
          "Tabela gift_reservations não encontrada. Execute sql/gift_reservations.sql no Neon.",
      },
      { status: 503 },
    );
  }

  if (kind === "database-config") {
    return NextResponse.json(
      {
        error:
          "Banco de dados não configurado. Adicione Postgres em Vercel → Storage.",
      },
      { status: 503 },
    );
  }

  return null;
}

export async function GET() {
  try {
    const rows = await listGiftReservations();
    return NextResponse.json(rows);
  } catch (error) {
    const storeError = giftStoreErrorResponse(classifyGiftStoreError(error));
    if (storeError) return storeError;

    return NextResponse.json(
      { error: "Erro ao carregar reservas de presentes." },
      { status: 500 },
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

    const reservation = await reserveGift(giftName.trim());
    return NextResponse.json({
      success: true,
      id: reservation.id,
      giftName: reservation.giftName,
    });
  } catch (error) {
    if (classifyGiftStoreError(error) === "unique") {
      return NextResponse.json(
        { error: "Este presente já foi reservado." },
        { status: 409 },
      );
    }

    const storeError = giftStoreErrorResponse(classifyGiftStoreError(error));
    if (storeError) return storeError;

    return NextResponse.json(
      { error: "Erro ao reservar presente." },
      { status: 500 },
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

    const removed = await removeGiftReservation(giftName.trim());
    if (!removed) {
      return NextResponse.json(
        { error: "Este presente não está reservado." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const storeError = giftStoreErrorResponse(classifyGiftStoreError(error));
    if (storeError) return storeError;

    return NextResponse.json(
      { error: "Erro ao remover reserva." },
      { status: 500 },
    );
  }
}
