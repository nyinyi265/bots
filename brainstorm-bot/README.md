# 🧠 Brainstorm Bot

A simple Telegram bot built with Node.js, TypeScript, and Telegraf.

## 1. Requirements

- Node.js 22+ recommended
- A Telegram bot created with @BotFather

Check your Node.js version:

```bash
node -v
npm -v
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure the Telegram token

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Open `.env` and replace:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

with the token provided by @BotFather.

Do not commit `.env` to Git.

## 4. Run in development

```bash
npm run dev
```

You should see:

```text
🧠 Brainstorm Bot is starting...
📡 Using long polling.
✅ Brainstorm Bot is running!
```

## 5. Test in Telegram

Open your bot and send:

```text
/start
```

Then try:

```text
/help
```

Or send:

```text
I want to build a React project for managing my car.
```

The current bot will echo the idea.

## 6. Build for production (local Node process)

```bash
npm run build
```

Then:

```bash
npm start
```

## 7. Deploy on Netlify

Netlify cannot run a long-lived Telegram polling/HTTP server. This project uses serverless webhook functions instead.

### Netlify settings

- Base directory: `brainstorm-bot`
- Build command: `npm run netlify:build`
- Publish directory: `public`

### Environment variables

Set these in the Netlify UI:

- `TELEGRAM_BOT_TOKEN`
- `WEBHOOK_SECRET`
- `WEBHOOK_SETUP_KEY`
- `DATABASE_URL`
- `AI_PROVIDER=qwen`
- `QWEN_API_KEY`
- `QWEN_BASE_URL`
- `QWEN_MODEL`
- `DATABASE_SSL=true` (if your hosted Postgres needs it; also auto-enabled on Netlify)

Do not use `AI_PROVIDER=ollama` on Netlify. Ollama is local-only.

### After deploy: set the Telegram webhook

Open:

```text
https://YOUR_SITE.netlify.app/.netlify/functions/set-webhook?key=YOUR_WEBHOOK_SETUP_KEY
```

That registers:

```text
https://YOUR_SITE.netlify.app/.netlify/functions/telegram
```

Health check:

```text
https://YOUR_SITE.netlify.app/health
```

## Project structure

```text
netlify/
├── functions/
│   ├── telegram.ts
│   ├── set-webhook.ts
│   └── health.ts
public/
└── index.html
src/
├── bot/
│   ├── create-bot.ts
│   ├── commands.ts
│   └── handlers.ts
├── config/
│   └── env.ts
└── index.ts
```
