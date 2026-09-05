import ollama from "ollama";

const MODEL = "llama3.2";

type Message = {
  role: 'user' | 'assistant';
  content: string;
}

export async function generateAIResponse(
  userMessage: string,
  systemPrompt: string,
  conversationHistory: Message[] = [],
): Promise<string> {
  const startTime = Date.now();
  const response = await ollama.chat({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...conversationHistory,
      {
        role: "user",
        content: userMessage,
      },
    ],
    // options: {
    //   num_predict: 300,
    //   temperature: 0.7,
    // },
    keep_alive: "30m"
  });

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`🧠 AI response generated in ${duration}s`);

  return response.message.content;
}
