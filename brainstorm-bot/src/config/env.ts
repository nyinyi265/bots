import 'dotenv/config';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error(
    'TELEGRAM_BOT_TOKEN is missing. Create a .env file and add your BotFather token.'
  );
}

export const env = {
  telegramBotToken: token,
};
