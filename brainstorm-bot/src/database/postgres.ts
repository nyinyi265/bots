import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not configured.");
}

const isServerless = Boolean(
  process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME,
);

const databaseUrl = process.env.DATABASE_URL;
const shouldUseSsl =
  process.env.DATABASE_SSL === "true" ||
  isServerless ||
  /sslmode=require/i.test(databaseUrl);

export const pool = new Pool({
  connectionString: databaseUrl,
  max: isServerless ? 1 : 10,
  idleTimeoutMillis: isServerless ? 5_000 : 30_000,
  connectionTimeoutMillis: 10_000,
  ssl: shouldUseSsl
    ? {
        rejectUnauthorized: false,
      }
    : undefined,
});

pool.on("error", (error) => {
  console.error("❌ Unexpected PostgreSQL error:", error);
});

export async function testDatabaseConnection(): Promise<void> {
  const result = await pool.query("SELECT NOW()");

  console.log("🐘 PostgreSQL connected:", result.rows[0]);
}
