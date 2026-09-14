import { generateEmbedding } from "./services/embedding.service.js";
import { saveMemory } from "./memory/vector.memory.js";

async function main() {
  const text = "I want to build an event management system";

  const embedding = await generateEmbedding(text);

  await saveMemory(
    "test-conversation",
    text,
    embedding,
    "user",
    "test1234",
    "Nyi Nyi Myat",
  );

  console.log("✅ Memory saved successfully.");
}

main();