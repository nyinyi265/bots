# 🧠 Brainstorm Bot

A simple Telegram bot built with Node.js, TypeScript, and Telegraf.

## 1. Requirements

- Node.js 20+ recommended
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

## 6. Build for production

```bash
npm run build
```

Then:

```bash
npm start
```

## Project structure

```text
src/
├── bot/
│   ├── commands.ts
│   └── handlers.ts
├── config/
│   └── env.ts
└── index.ts
```

### Next step

The next version can replace the echo response with an AI service:

```text
Telegram
   ↓
Brainstorm Bot
   ↓
AI Service
   ↓
AI Model
   ↓
Brainstorm response
   ↓
Telegram
```
