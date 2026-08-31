import { Context } from 'telegraf';
import { generateBrainstormResponse } from '../services/ai.service.js';

function isGroupChat(ctx: Context): boolean {
  return ctx.chat?.type === 'group' || ctx.chat?.type === 'supergroup';
}

function isBotMentioned(ctx: Context): boolean {
  if (!ctx.message || !('text' in ctx.message) || !ctx.botInfo) return false;

  const text = ctx.message.text;
  const botUsername = ctx.botInfo.username?.toLowerCase();
  if (!botUsername) return false;

  return (
    ctx.message.entities?.some((entity) => {
      if (entity.type === 'mention') {
        const mention = text.substring(entity.offset, entity.offset + entity.length);
        return mention.toLowerCase() === `@${botUsername}`;
      }
      if (entity.type === 'text_mention') {
        return entity.user.id === ctx.botInfo!.id;
      }
      return false;
    }) ?? false
  );
}

function isReplyToBot(ctx: Context): boolean {
  if (!ctx.message || !ctx.botInfo) return false;
  const msg = ctx.message as { reply_to_message?: { from?: { id: number } } };
  return msg.reply_to_message?.from?.id === ctx.botInfo.id;
}

function stripMention(text: string, botUsername: string): string {
  return text.replace(new RegExp(`@${botUsername}`, 'gi'), '').trim();
}

export async function textMessageHandler(ctx: Context): Promise<void> {
  if (!ctx.message || !('text' in ctx.message)) {
    return;
  }

  let text = ctx.message.text.trim();

  if (!text) {
    return;
  }

  if (isGroupChat(ctx)) {
    if (!isBotMentioned(ctx) && !isReplyToBot(ctx)) {
      return;
    }

    if (ctx.botInfo?.username) {
      text = stripMention(text, ctx.botInfo.username);
    }

    if (!text) {
      return;
    }
  }

  try {
    await ctx.sendChatAction('typing');

    const response = await generateBrainstormResponse(text);

    if (isGroupChat(ctx)) {
      await ctx.reply(response, {
        reply_parameters: { message_id: ctx.message.message_id },
      });
    } else {
      await ctx.reply(response);
    }
  } catch (error) {
    console.error('AI error:', error);

    const errorMessage =
      '❌ Sorry, I could not generate a response right now. Please try again.';

    if (isGroupChat(ctx)) {
      await ctx.reply(errorMessage, {
        reply_parameters: { message_id: ctx.message.message_id },
      });
    } else {
      await ctx.reply(errorMessage);
    }
  }
}