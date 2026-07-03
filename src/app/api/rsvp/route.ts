import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { weddingConfig } from "@/config/wedding";

export interface RSVPRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  attending: "yes" | "no";
  guests: number;
  dietary: string;
  message: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "rsvps.json");

async function ensureDataFile() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

async function readRSVPs(): Promise<RSVPRecord[]> {
  await ensureDataFile();
  const content = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(content) as RSVPRecord[];
}

async function writeRSVPs(records: RSVPRecord[]) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), "utf-8");
}

function isDeadlinePassed() {
  return Date.now() > new Date(weddingConfig.rsvpDeadline).getTime();
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
      dietary,
      message,
    } = body;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Nome e e-mail são obrigatórios." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
    }

    const additionalGuests = Math.min(Math.max(Number(guests) || 0, 0), 10);
    const guestCount = attending === "yes" ? 1 + additionalGuests : 0;

    const records = await readRSVPs();
    const duplicate = records.find(
      (r) => r.email === email.trim().toLowerCase()
    );
    if (duplicate) {
      return NextResponse.json(
        { error: "Este e-mail já confirmou presença." },
        { status: 409 }
      );
    }

    const record: RSVPRecord = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || "").trim(),
      attending: attending === "no" ? "no" : "yes",
      guests: guestCount,
      dietary: (dietary || "").trim(),
      message: (message || "").trim(),
      createdAt: new Date().toISOString(),
    };

    records.push(record);
    await writeRSVPs(records);

    return NextResponse.json({ success: true, id: record.id });
  } catch {
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
    const records = await readRSVPs();
    return NextResponse.json(records);
  } catch {
    return NextResponse.json(
      { error: "Erro ao carregar confirmações." },
      { status: 500 }
    );
  }
}
