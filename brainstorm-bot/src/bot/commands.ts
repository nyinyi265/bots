import { Context } from 'telegraf';

export async function startCommand(ctx: Context): Promise<void> {
  await ctx.reply(
    [
      '🧠 Welcome to Brainstorm Bot!',
      '',
      'I am your brainstorming assistant.',
      '',
      'Try sending me an idea or use:',
      '/help - Show available commands',
      '',
      'More AI-powered features are coming next.'
    ].join('\n')
  );
}

export async function helpCommand(ctx: Context): Promise<void> {
  await ctx.reply(
    [
      '🧠 Brainstorm Bot Help',
      '',
      '/start - Start the bot',
      '/help - Show this help message',
      '',
      'You can also send me any text message.',
      'For now, I will echo your message.'
    ].join('\n')
  );
}
