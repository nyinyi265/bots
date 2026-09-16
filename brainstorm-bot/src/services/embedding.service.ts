const OLLAMA_URL =
  process.env.OLLAMA_URL ?? "http://localhost:11434";

const EMBEDDING_MODEL = "nomic-embed-text";

export async function generateEmbedding(
  text: string,
): Promise<number[]> {
  const response = await fetch(`${OLLAMA_URL}/api/embed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Embedding request failed: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as {
    embeddings: number[][];
  };

  const embedding = data.embeddings?.[0];

  if (!embedding || embedding.length !== 768) {
    throw new Error(
      `Invalid embedding returned by Ollama. Expected 768 dimensions, got ${embedding?.length ?? 0}.`,
    );
  }

  return embedding;
}