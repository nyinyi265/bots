import OpenAI from "openai";
import type { Message } from "../memory/conversation.memory.js";
import type { Memory } from "../memory/vector.memory.js";

const AI_PROVIDER = process.env.AI_PROVIDER ?? "ollama";

const OLLAMA_URL =
  process.env.OLLAMA_URL ?? "http://localhost:11434";

const OLLAMA_MODEL =
  process.env.OLLAMA_MODEL ?? "llama3.2";

const QWEN_MODEL =
  process.env.QWEN_MODEL ?? "qwen3.8-max";

const qwenClient = new OpenAI({
  apiKey: process.env.QWEN_API_KEY,
  baseURL: process.env.QWEN_BASE_URL,
});

export async function generateAIResponse(
  userMessage: string,
  systemPrompt: string,
  conversationHistory: Message[] = [],
  username?: string,
  persistentMemories: Memory[] = [],
): Promise<string> {
  const startTime = Date.now();

  const history = conversationHistory.map((message) => ({
    role: message.role,
    content:
      message.role === "user" && message.username
        ? `${message.username}: ${message.content}`
        : message.content,
  }));

  const currentMessage = username
    ? `${username}: ${userMessage}`
    : userMessage;

  const memoryContext =
    persistentMemories.length > 0
      ? `
Relevant memories from previous conversations:

${persistentMemories
  .map(
    (memory) =>
      `- ${memory.username ?? "User"}: ${memory.content}`,
  )
  .join("\n")}
`
      : "";

  const enhancedSystemPrompt = `
${systemPrompt}

${memoryContext}
`;

  let response: string;

  if (AI_PROVIDER === "qwen") {
    response = await generateWithCustomModal(
      enhancedSystemPrompt,
      history,
      currentMessage,
    );
  } else {
    response = await generateWithOllama(
      enhancedSystemPrompt,
      history,
      currentMessage,
    );
  }

  const duration =
    ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(
    `🧠 AI response generated in ${duration}s using ${AI_PROVIDER}`,
  );

  return response;
}

async function generateWithCustomModal(
  systemPrompt: string,
  history: {
    role: "user" | "assistant";
    content: string;
  }[],
  currentMessage: string,
): Promise<string> {
  const completion =
    await qwenClient.chat.completions.create({
      model: QWEN_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...history,
        {
          role: "user",
          content: currentMessage,
        },
      ],
    });

  const content =
    completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error(
      "Qwen returned an empty response.",
    );
  }

  return content;
}

async function generateWithOllama(
  systemPrompt: string,
  history: {
    role: "user" | "assistant";
    content: string;
  }[],
  currentMessage: string,
): Promise<string> {
  const response = await fetch(
    `${OLLAMA_URL}/api/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...history,
          {
            role: "user",
            content: currentMessage,
          },
        ],
        stream: false,
        keep_alive: "30m",
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Ollama request failed: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as {
    message?: {
      content?: string;
    };
  };

  const content = data.message?.content;

  if (!content) {
    throw new Error(
      "Ollama returned an empty response.",
    );
  }

  return content;
}