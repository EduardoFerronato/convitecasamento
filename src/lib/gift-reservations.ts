import { getSql } from "@/lib/db";

export interface GiftReservation {
  id: string;
  giftName: string;
  reservedAt: string;
}

const memoryReservations: GiftReservation[] = [];

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

export function classifyGiftStoreError(error: unknown):
  | "missing-table"
  | "unique"
  | "database-config"
  | "unknown" {
  if (isMissingTable(error)) return "missing-table";
  if (isUniqueViolation(error)) return "unique";
  if (isDatabaseConfigError(error)) return "database-config";
  return "unknown";
}

export async function listGiftReservations(): Promise<GiftReservation[]> {
  if (!hasDatabaseUrl()) {
    return [...memoryReservations].sort(
      (a, b) => new Date(b.reservedAt).getTime() - new Date(a.reservedAt).getTime(),
    );
  }

  const sql = getSql();
  const rows = await sql`
    SELECT
      id,
      gift_name AS "giftName",
      reserved_at AS "reservedAt"
    FROM gift_reservations
    ORDER BY reserved_at DESC
  `;

  return rows as GiftReservation[];
}

export async function reserveGift(giftName: string): Promise<GiftReservation> {
  if (!hasDatabaseUrl()) {
    const existing = memoryReservations.find((item) => item.giftName === giftName);
    if (existing) {
      const error = new Error("duplicate");
      (error as Error & { code: string }).code = "23505";
      throw error;
    }

    const reservation: GiftReservation = {
      id: crypto.randomUUID(),
      giftName,
      reservedAt: new Date().toISOString(),
    };
    memoryReservations.push(reservation);
    return reservation;
  }

  const id = crypto.randomUUID();
  const sql = getSql();

  await sql`
    INSERT INTO gift_reservations (id, gift_name)
    VALUES (${id}, ${giftName})
  `;

  return {
    id,
    giftName,
    reservedAt: new Date().toISOString(),
  };
}

export async function removeGiftReservation(giftName: string): Promise<boolean> {
  if (!hasDatabaseUrl()) {
    const index = memoryReservations.findIndex((item) => item.giftName === giftName);
    if (index === -1) return false;
    memoryReservations.splice(index, 1);
    return true;
  }

  const sql = getSql();
  const rows = await sql`
    DELETE FROM gift_reservations
    WHERE gift_name = ${giftName}
    RETURNING id
  `;

  return rows.length > 0;
}
