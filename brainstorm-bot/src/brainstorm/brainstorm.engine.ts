import { generateAIResponse } from '../services/ai.service.js';
import { BRAINSTORM_SYSTEM_PROMPT } from './brainstorm.prompt.js';
import type { Message } from "../memory/conversation.memory.js";

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