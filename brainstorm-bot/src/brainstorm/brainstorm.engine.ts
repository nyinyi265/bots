import { generateAIResponse } from '../services/ai.service.js';
import { BRAINSTORM_SYSTEM_PROMPT } from './brainstorm.prompt.js';

type Message = {
  role: 'user' | 'assistant';
  content: string;
}

export async function brainstorm(
  userMessage: string,
  conversationHistory: Message [] = [],
): Promise<string> {
  return generateAIResponse(
    userMessage,
    BRAINSTORM_SYSTEM_PROMPT,
    conversationHistory,
  );
}