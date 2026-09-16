import { createBot } from "./bot/create-bot.js";
import { testDatabaseConnection } from "./database/postgres.js";

async function main(): Promise<void> {
  await testDatabaseConnection();

  const bot = createBot();

  await bot.telegram.getMe();

  console.log("🧠 Brainstorm Bot is starting...");
  console.log("📡 Using long polling (local development).");

  await bot.launch();

  console.log("✅ Brainstorm Bot is running!");

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}

main().catch((error) => {
  console.error("❌ Failed to start Brainstorm Bot:", error);
  process.exit(1);
});
