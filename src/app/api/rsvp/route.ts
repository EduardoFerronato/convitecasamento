import { NextRequest, NextResponse } from "next/server";
import { weddingConfig } from "@/config/wedding";
import {
  classifyRsvpStoreError,
  createRsvp,
  deleteRsvp,
  listRsvps,
  updateRsvpGuests,
} from "@/lib/rsvp-store";

export type { RSVPRecord } from "@/lib/rsvp-store";

function isDeadlinePassed() {
  return Date.now() > new Date(weddingConfig.rsvpDeadline).getTime();
}

function checkAdminKey(request: NextRequest) {
  const adminKey = process.env.RSVP_ADMIN_KEY;
  if (adminKey) {
    return request.headers.get("x-admin-key") === adminKey;
  }
  return process.env.NODE_ENV !== "production";
}

function storeErrorResponse(kind: ReturnType<typeof classifyRsvpStoreError>) {
  if (kind === "missing-table") {
    return NextResponse.json(
      {
        error:
          "Tabela rsvps não encontrada. Execute sql/schema.sql no banco da Vercel.",
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

export async function POST(request: NextRequest) {
  try {
    if (isDeadlinePassed()) {
      return NextResponse.json(
        { error: "O prazo para confirmação de presença já encerrou." },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { name, email, phone, attending = "yes", guests, message } = body;

    if (attending === "no") {
      if (!name?.trim()) {
        return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });
      }
    } else if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Nome e e-mail são obrigatórios." },
        { status: 400 },
      );
    }

    if (attending !== "no" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
    }

    const additionalGuests = Math.min(Math.max(Number(guests) || 0, 0), 3);
    const guestCount = attending === "yes" ? 1 + additionalGuests : 0;
    const id = crypto.randomUUID();
    const normalizedEmail =
      attending === "no"
        ? `ausente-${id}@rsvp.local`
        : email.trim().toLowerCase();

    await createRsvp({
      id,
      name: name.trim(),
      email: normalizedEmail,
      phone: (phone || "").trim(),
      attending: attending === "no" ? "no" : "yes",
      guests: guestCount,
      message: (message || "").trim(),
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    if (classifyRsvpStoreError(error) === "unique") {
      return NextResponse.json(
        { error: "Este e-mail já confirmou presença." },
        { status: 409 },
      );
    }

    const storeError = storeErrorResponse(classifyRsvpStoreError(error));
    if (storeError) return storeError;

    return NextResponse.json(
      { error: "Erro interno ao salvar confirmação." },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  if (!checkAdminKey(request)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const rows = await listRsvps();
    return NextResponse.json(rows);
  } catch (error) {
    const storeError = storeErrorResponse(classifyRsvpStoreError(error));
    if (storeError) return storeError;

    return NextResponse.json(
      { error: "Erro ao carregar confirmações." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (!checkAdminKey(request)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, guests } = body;

    if (typeof id !== "string" || !id.trim()) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    const guestCount = Math.min(Math.max(Number(guests) || 0, 0), 4);
    const updated = await updateRsvpGuests(id, guestCount);

    if (!updated) {
      return NextResponse.json(
        { error: "Confirmação não encontrada." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, guests: guestCount });
  } catch (error) {
    const storeError = storeErrorResponse(classifyRsvpStoreError(error));
    if (storeError) return storeError;

    return NextResponse.json(
      { error: "Erro ao atualizar confirmação." },
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
    const { id } = body;

    if (typeof id !== "string" || !id.trim()) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    const removed = await deleteRsvp(id);
    if (!removed) {
      return NextResponse.json(
        { error: "Confirmação não encontrada." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const storeError = storeErrorResponse(classifyRsvpStoreError(error));
    if (storeError) return storeError;

    return NextResponse.json(
      { error: "Erro ao remover confirmação." },
      { status: 500 },
    );
  }
}
