import { neon } from "@neondatabase/serverless";

export function getSql() {
  const url = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "POSTGRES_URL ou DATABASE_URL não configurada. Conecte o Neon em Vercel → Storage."
    );
  }
  return neon(url);
}
