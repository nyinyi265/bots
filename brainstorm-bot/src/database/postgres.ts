import pg from "pg";

const { Pool } = pg;

const isServerless = Boolean(
  process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME,
);

const databaseUrl = process.env.DATABASE_URL;

const shouldUseSsl =
  process.env.DATABASE_SSL === "true" ||
  isServerless ||
  (databaseUrl ? /sslmode=require/i.test(databaseUrl) : false);

export const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      max: isServerless ? 1 : 10,
      idleTimeoutMillis: isServerless ? 5_000 : 30_000,
      connectionTimeoutMillis: 10_000,
      ssl: shouldUseSsl
        ? {
            rejectUnauthorized: false,
          }
        : undefined,
    })
  : null;

if (pool) {
  pool.on("error", (error) => {
    console.error("❌ Unexpected PostgreSQL error:", error);
  });
}

export async function testDatabaseConnection(): Promise<void> {
  if (!pool) {
    console.warn(
      "⚠️ DATABASE_URL is not configured. Skipping database connection test.",
    );
    return;
  }

  const result = await pool.query("SELECT NOW()");

  console.log("🐘 PostgreSQL connected:", result.rows[0]);
}
