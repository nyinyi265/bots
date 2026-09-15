import { Context } from "telegraf";
import { brainstorm } from "../brainstorm/brainstorm.engine.js";
import {
  getConversation,
  addMessage,
  clearConversation,
  getOrCreateTopic,
  getTopicMessages,
} from "../memory/conversation.memory.js";
import { generateEmbedding } from "../services/embedding.service.js";
import { searchMemories, saveMemory } from "../memory/vector.memory.js";
import type { Memory } from "../memory/vector.memory.js";

const BOT_USERNAME = "zethus_brainstorm_bot";

export async function textMessageHandler(ctx: Context): Promise<void> {
  if (!ctx.message || !("text" in ctx.message)) {
    return;
  }
  const requestStartTime = Date.now();

  const message = ctx.message;
  const text = message.text.trim();

  const chatType = ctx.chat?.type;
  const isPrivateChat = chatType === "private";
  const botMention = `@${BOT_USERNAME}`;

  if (!isPrivateChat) {
    if (!text.toLowerCase().includes(botMention.toLowerCase())) {
      return;
    }
  }

  const question = text
    .replace(new RegExp(`@${BOT_USERNAME}\\b`, "gi"), "")
    .trim();

  if (!question) {
    await ctx.reply("🧠 What would you like to brainstorm about?");
    return;
  }

  console.log("🧠 Brainstorm question:", question);

  const conversationId = String(ctx.chat!.id);

  const username = ctx.from?.username ?? ctx.from?.first_name ?? "Unknown user";

  try {
    await ctx.sendChatAction("typing");

    let persistentMemories: Memory[] = [];
    let embedding: number[] | undefined;

    try {
      embedding = await generateEmbedding(question);

      persistentMemories = await searchMemories(conversationId, embedding, 5);

      console.log(`🧠 Persistent memories found: ${persistentMemories.length}`);
    } catch (error) {
      console.error("⚠️ Persistent memory unavailable:", error);

      console.log("🧠 Continuing without persistent memory.");
  

    const topic = getOrCreateTopic(conversationId, question);

    console.log(`🧠 Topic selected: "${topic.name}" (${topic.id})`);

    const conversationHistory = getTopicMessages(conversationId, topic.id);

    console.log(`📚 Topic history: ${conversationHistory.length} messages`);

    const response = await brainstorm(
      question,
      conversationHistory,
      username,
      persistentMemories,
    );
    try {
      if (embedding) {
        await saveMemory(
          conversationId,
          question,
          embedding,
          "user",
          String(ctx.from?.id),
          username,
        );
      }

      // Save AI response
      const responseEmbedding = await generateEmbedding(response);

      await saveMemory(
        conversationId,
        response,
        responseEmbedding,
        "assistant",
      );

      console.log("💾 Persistent memory saved.");
    } catch (error) {
      console.error("⚠️ Failed to save persistent memory:", error);
    }

    addMessage(
      conversationId,
      {
        role: "user",
        content: question,
        userId: String(ctx.from?.id),
        username,
      },
      topic.id,
    );

    addMessage(
      conversationId,
      {
        role: "assistant",
        content: response,
      },
      topic.id,
    );

    const totalDuration =
    ((Date.now() - requestStartTime) / 1000).toFixed(2);

    console.log(
      `⏱️ Total request time: ${totalDuration}s`,
    );

    await ctx.reply(response);

  } catch (error) {
    console.error("❌ Brainstorm error:", error);

    try {
      await ctx.reply(
        "❌ Sorry, I could not generate a brainstorming response right now. Please try again.",
      );
    } catch (replyError) {
      console.error("❌ Failed to send error message:", replyError);
    }
  }
}

export async function clearCommandHandler(ctx: Context): Promise<void> {
  const conversationId = String(ctx.chat!.id);

  console.log(`🧹 Clearing conversation: ${conversationId}`);

  clearConversation(conversationId);

  console.log("🧹 Conversation after clear:", getConversation(conversationId));

  await ctx.reply("🧹 Conversation cleared. Let's start fresh!");
}
