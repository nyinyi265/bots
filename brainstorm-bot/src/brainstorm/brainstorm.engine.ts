import { generateAIResponse } from '../services/ai.service.js';
import { BRAINSTORM_SYSTEM_PROMPT } from './brainstorm.prompt.js';

export async function brainstorm(
  userMessage: string
): Promise<string> {
  return generateAIResponse(
    userMessage,
    BRAINSTORM_SYSTEM_PROMPT
  );
}