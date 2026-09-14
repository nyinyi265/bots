import { generateEmbedding } from "./services/embedding.service.js";

async function main() {
  const embedding = await generateEmbedding(
    "I want to build an event management system",
  );

  console.log("Embedding dimensions:", embedding.length);
  console.log("First 5 values:", embedding.slice(0, 5));
}

main().catch(console.error);