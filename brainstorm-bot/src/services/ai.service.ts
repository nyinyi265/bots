import ollama from "ollama";
import {Message} from '../memory/conversation.memory.js'

const MODEL = "llama3.2";

export async function generateAIResponse(
  userMessage: string,
  systemPrompt: string,
  conversationHistory: Message[] = [],
): Promise<string> {
  const startTime = Date.now();

  const history = conversationHistory.map((message) => ({
    role: message.role,
    content:
      message.role === "user" && message.username
        ? `${message.username}: ${message.content}`
        : message.content,
  }));

  const response = await ollama.chat({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...history,
      {
        role: "user",
        content: userMessage,
      },
    ],
    keep_alive: "30m",
  });

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`🧠 AI response generated in ${duration}s`);

  return response.message.content;
}
