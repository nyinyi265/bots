import { pool } from "../database/postgres.js";

export type Memory = {
  id: number;
  conversationId: string;
  userId?: string;
  username?: string;
  role: "user" | "assistant";
  content: string;
  similarity: number;
  createdAt: Date;
};

export async function saveMemory(
  conversationId: string,
  content: string,
  embedding: number[],
  role: "user" | "assistant",
  userId?: string,
  username?: string,
): Promise<void> {
  if (!pool) {
    console.warn("⚠️ Database unavailable. Skipping saveMemory.");
    return;
  }

  const vector = `[${embedding.join(",")}]`;

  await pool.query(
    `
      INSERT INTO conversation_memories
        (
          conversation_id,
          user_id,
          username,
          role,
          content,
          embedding
        )
      VALUES
        ($1, $2, $3, $4, $5, $6::vector)
    `,
    [conversationId, userId ?? null, username ?? null, role, content, vector],
  );
}

export async function searchMemories(
  conversationId: string,
  embedding: number[],
  limit = 5,
  minSimilarity = 0.65,
): Promise<Memory[]> {
  if (!pool) {
    console.warn(
      "⚠️ Database unavailable. Skipping searchMemories.",
    );
    return [];
  }

  const vector = `[${embedding.join(",")}]`;

  const result = await pool.query(
    `
      SELECT
        id,
        conversation_id,
        user_id,
        username,
        role,
        content,
        1 - (embedding <=> $2::vector) AS similarity,
        created_at
      FROM conversation_memories
      WHERE conversation_id = $1
      ORDER BY embedding <=> $2::vector
      LIMIT $3
    `,
    [conversationId, vector, limit],
  );

  return result.rows
    .filter((row) => Number(row.similarity) >= minSimilarity)
    .map((row) => ({
      id: row.id,
      conversationId: row.conversation_id,
      userId: row.user_id ?? undefined,
      username: row.username ?? undefined,
      role: row.role,
      content: row.content,
      similarity: Number(row.similarity),
      createdAt: row.created_at,
    }));
}
