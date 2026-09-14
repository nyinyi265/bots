import "./config/env.js";
import { generateEmbedding } from "./services/embedding.service.js";
import { searchMemories } from "./memory/vector.memory.js";

async function main() {
  const question = "What database should I use for my event management system?";

  const embedding = await generateEmbedding(question);

  const memories = await searchMemories("test-conversation", embedding, 5);

  console.log("\n🧠 Relevant memories:\n");

  for (const memory of memories) {
    console.log(
      `[${memory.similarity.toFixed(3)}] ` +
        `[${memory.role}] ` +
        `${memory.username ?? "Unknown"}: ` +
        memory.content,
    );
  }
}

main();