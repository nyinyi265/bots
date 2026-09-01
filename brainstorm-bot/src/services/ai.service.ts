import ollama from "ollama";

const MODEL = "llama3.2";

export async function generateAIResponse(
  userMessage: string,
  systemPrompt: string,
): Promise<string> {
  const startTime = Date.now();
  const response = await ollama.chat({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`🧠 AI response generated in ${duration}s`);

  return response.message.content;
}
