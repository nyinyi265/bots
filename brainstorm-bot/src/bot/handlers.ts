import { Context } from 'telegraf';
import { generateBrainstormResponse } from '../services/ai.service.js';

export async function textMessageHandler(ctx: Context): Promise<void> {
  if (!ctx.message || !('text' in ctx.message)) {
    return;
  }

  const text = ctx.message.text.trim();

  if (!text) {
    return;
  }

  try {
    await ctx.sendChatAction('typing');

    const response = await generateBrainstormResponse(text);

    await ctx.reply(response);
  } catch (error) {
    console.error('AI error:', error);

    await ctx.reply(
      '❌ Sorry, I could not generate a response right now. Please try again.'
    );
  }
}