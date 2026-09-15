import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not configured.");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

pool.on("error", (error) => {
  console.error("❌ Unexpected PostgreSQL error:", error);
});

export async function testDatabaseConnection(): Promise<void> {
  const result = await pool.query("SELECT NOW()");

  console.log(
    "🐘 PostgreSQL connected:",
    result.rows[0],
  );
}