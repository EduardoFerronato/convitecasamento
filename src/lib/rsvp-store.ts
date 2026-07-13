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

function hasDatabaseUrl() {
  return Boolean(process.env.POSTGRES_URL ?? process.env.DATABASE_URL);
}

function isMissingTable(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "42P01"
  );
}

function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "23505"
  );
}

function isDatabaseConfigError(error: unknown) {
  return (
    error instanceof Error &&
    error.message.includes("POSTGRES_URL ou DATABASE_URL não configurada")
  );
}

export function classifyRsvpStoreError(error: unknown):
  | "missing-table"
  | "unique"
  | "database-config"
  | "unknown" {
  if (isMissingTable(error)) return "missing-table";
  if (isUniqueViolation(error)) return "unique";
  if (isDatabaseConfigError(error)) return "database-config";
  return "unknown";
}

const memoryRecords: RSVPRecord[] = [];
let seeded = false;

function seedIfNeeded() {
  if (seeded) return;
  seeded = true;
  if (process.env.NODE_ENV === "production") return;

  const now = Date.now();
  memoryRecords.push(
    {
      id: crypto.randomUUID(),
      name: "Julia Schulz Nunes",
      email: "jsnunes@gmail.com",
      phone: "+5566992548201",
      attending: "yes",
      guests: 1,
      message: "Amo vocês! Espero estar ao lado de vcs por muitos anos.",
      createdAt: new Date(now - 1000 * 60 * 10).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "Lucas Ferronato Pelle Bastos Peres dos Santos",
      email: "lucas.fe.pelle@gmail.com",
      phone: "41992039462",
      attending: "yes",
      guests: 2,
      message: "Que o casamento de vcs seja tão perfeito quanto eu.",
      createdAt: new Date(now - 1000 * 60 * 20).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "Convidado Ausente",
      email: `ausente-${crypto.randomUUID()}@rsvp.local`,
      phone: "",
      attending: "no",
      guests: 0,
      message: "Não poderei comparecer, mas desejo toda felicidade!",
      createdAt: new Date(now - 1000 * 60 * 30).toISOString(),
    },
  );
}

export async function listRsvps(): Promise<RSVPRecord[]> {
  if (!hasDatabaseUrl()) {
    seedIfNeeded();
    return [...memoryRecords].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

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

  return rows as RSVPRecord[];
}

export async function createRsvp(record: {
  id: string;
  name: string;
  email: string;
  phone: string;
  attending: "yes" | "no";
  guests: number;
  message: string;
}): Promise<void> {
  if (!hasDatabaseUrl()) {
    seedIfNeeded();
    const duplicate = memoryRecords.some(
      (item) => item.email === record.email && !record.email.endsWith("@rsvp.local"),
    );
    if (duplicate) {
      const error = new Error("duplicate");
      (error as Error & { code: string }).code = "23505";
      throw error;
    }
    memoryRecords.push({ ...record, createdAt: new Date().toISOString() });
    return;
  }

  const sql = getSql();
  await sql`
    INSERT INTO rsvps (id, name, email, phone, attending, guests, message)
    VALUES (
      ${record.id},
      ${record.name},
      ${record.email},
      ${record.phone},
      ${record.attending},
      ${record.guests},
      ${record.message}
    )
  `;
}

export async function updateRsvpGuests(
  id: string,
  guests: number,
): Promise<boolean> {
  if (!hasDatabaseUrl()) {
    seedIfNeeded();
    const record = memoryRecords.find((item) => item.id === id);
    if (!record) return false;
    record.guests = guests;
    return true;
  }

  const sql = getSql();
  const rows = await sql`
    UPDATE rsvps
    SET guests = ${guests}
    WHERE id = ${id}
    RETURNING id
  `;
  return rows.length > 0;
}

export async function deleteRsvp(id: string): Promise<boolean> {
  if (!hasDatabaseUrl()) {
    seedIfNeeded();
    const index = memoryRecords.findIndex((item) => item.id === id);
    if (index === -1) return false;
    memoryRecords.splice(index, 1);
    return true;
  }

  const sql = getSql();
  const rows = await sql`
    DELETE FROM rsvps
    WHERE id = ${id}
    RETURNING id
  `;
  return rows.length > 0;
}
