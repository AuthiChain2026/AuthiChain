import { router } from './utils/router'
import { telegramWebhook } from './routes/telegram-webhook'
import { setupWebhook } from './routes/telegram-setup'

export interface Env {
  TELEGRAM_BOT_TOKEN: string
  TELEGRAM_WEBHOOK_SECRET: string
  TELEGRAM_ADMIN_CHAT_ID: string
  SITE_URL: string
  ADMIN_API_KEY: string
  DATABASE: D1Database
  SESSIONS: KVNamespace
}

import { Telegram } from './services/telegram'
import { sendDailyDigest } from './services/admin'

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return router(request, env, ctx, [
      ['POST', '/api/telegram/webhook', telegramWebhook],
      ['POST', '/api/telegram/setup-webhook', setupWebhook],
    ])
  },

  // Cron trigger: runs daily at 08:00 UTC (configure in wrangler.toml)
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    const telegram = new Telegram(env.TELEGRAM_BOT_TOKEN)
    ctx.waitUntil(sendDailyDigest(env, telegram))
  },
}
