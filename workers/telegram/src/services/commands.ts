import type { Env } from '../index'
import type { Telegram } from './telegram'
import type { TelegramUpdate } from './db'

export async function handleCommand(
  env: Env,
  telegram: Telegram,
  update: TelegramUpdate
): Promise<Response> {
  const text = update.message?.text ?? ''
  const chatId = update.message!.chat.id
  const userId = update.message!.from.id

  if (text.startsWith('/start')) {
    return telegram.sendMessage(
      chatId,
      `🛡️ <b>AuthiChain Bot</b>\n\nVerify product authenticity using TrueMark™ IDs.\n\nSend a TrueMark™ ID (e.g. <code>TM-1234567890-ABCD1234</code>) to verify a product, or use /help for available commands.\n\n💡 Tip: Use /connect to link your email and receive agent-browser Pro license keys directly here.`,
      { parse_mode: 'HTML' }
    )
  }

  if (text.startsWith('/help')) {
    return telegram.sendMessage(
      chatId,
      `<b>Available commands</b>\n\n/start — Welcome message\n/verify &lt;TrueMark ID&gt; — Verify a product\n/connect &lt;email&gt; — Link your email for license delivery\n/status — Check bot status\n/help — Show this message`,
      { parse_mode: 'HTML' }
    )
  }

  if (text.startsWith('/status')) {
    return telegram.sendMessage(chatId, '✅ AuthiChain Bot is online.')
  }

  if (text.startsWith('/verify ')) {
    const truemarkId = text.replace('/verify ', '').trim()
    return handleVerify(env, telegram, chatId, truemarkId)
  }

  if (text.startsWith('/connect ')) {
    const email = text.replace('/connect ', '').trim().toLowerCase()
    return handleConnect(env, telegram, chatId, userId, email)
  }

  if (text.startsWith('/admin') && String(userId) === env.TELEGRAM_ADMIN_CHAT_ID) {
    return telegram.sendMessage(chatId, '🔐 Admin panel ready.', { parse_mode: 'HTML' })
  }

  // If message looks like a TrueMark ID, auto-verify
  if (/^TM-\d+-[A-Z0-9]+$/i.test(text.trim())) {
    return handleVerify(env, telegram, chatId, text.trim())
  }

  return telegram.sendMessage(chatId, "Unknown command. Send /help for a list of commands.")
}

async function handleConnect(
  env: Env,
  telegram: Telegram,
  chatId: number,
  _userId: number,
  email: string
): Promise<Response> {
  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return telegram.sendMessage(
      chatId,
      `⚠️ <b>Invalid email</b>\n\nUsage: <code>/connect your@email.com</code>`,
      { parse_mode: 'HTML' }
    )
  }

  // Store chatId in KV keyed by email — used by license-issuer to deliver keys
  await env.SESSIONS.put(`tg:${email}`, String(chatId), {
    expirationTtl: 60 * 60 * 24 * 365, // 1 year
  })

  return telegram.sendMessage(
    chatId,
    `✅ <b>Email linked</b>\n\nYour Telegram account is now connected to <code>${email}</code>.\n\nWhen you purchase an agent-browser Pro license, your key will be delivered here automatically.\n\n<a href="https://authichain.com/agent-browser">Get Pro →</a>`,
    { parse_mode: 'HTML' }
  )
}

async function handleVerify(
  env: Env,
  telegram: Telegram,
  chatId: number,
  truemarkId: string
): Promise<Response> {
  try {
    const res = await fetch(`${env.SITE_URL}/api/verify/${encodeURIComponent(truemarkId)}`)

    if (res.status === 404) {
      return telegram.sendMessage(
        chatId,
        `⚠️ <b>Not Found</b>\n\nNo product found for TrueMark ID: <code>${truemarkId}</code>\n\nThis product may not be registered or the ID may be incorrect.`,
        { parse_mode: 'HTML' }
      )
    }

    if (!res.ok) {
      return telegram.sendMessage(chatId, '❌ Verification service unavailable. Please try again.')
    }

    const data: any = await res.json()
    const product = data.product

    const lines = [
      `✅ <b>AUTHENTIC</b>`,
      ``,
      `<b>${product.name}</b>`,
      product.brand ? `Brand: ${product.brand}` : null,
      product.category ? `Category: ${product.category}` : null,
      ``,
      `🔗 TrueMark™: <code>${truemarkId}</code>`,
      product.blockchain_tx_hash
        ? `📦 Tx: <code>${product.blockchain_tx_hash.slice(0, 20)}…</code>`
        : null,
    ]
      .filter(Boolean)
      .join('\n')

    return telegram.sendMessage(chatId, lines, { parse_mode: 'HTML' })
  } catch {
    return telegram.sendMessage(chatId, '❌ Failed to verify product. Please try again.')
  }
}


async function handleVerify(
  env: Env,
  telegram: Telegram,
  chatId: number,
  truemarkId: string
): Promise<Response> {
  try {
    const res = await fetch(`${env.SITE_URL}/api/verify/${encodeURIComponent(truemarkId)}`)

    if (res.status === 404) {
      return telegram.sendMessage(
        chatId,
        `⚠️ <b>Not Found</b>\n\nNo product found for TrueMark ID: <code>${truemarkId}</code>\n\nThis product may not be registered or the ID may be incorrect.`,
        { parse_mode: 'HTML' }
      )
    }

    if (!res.ok) {
      return telegram.sendMessage(chatId, '❌ Verification service unavailable. Please try again.')
    }

    const data: any = await res.json()
    const product = data.product

    const lines = [
      `✅ <b>AUTHENTIC</b>`,
      ``,
      `<b>${product.name}</b>`,
      product.brand ? `Brand: ${product.brand}` : null,
      product.category ? `Category: ${product.category}` : null,
      ``,
      `🔗 TrueMark™: <code>${truemarkId}</code>`,
      product.blockchain_tx_hash
        ? `📦 Tx: <code>${product.blockchain_tx_hash.slice(0, 20)}…</code>`
        : null,
    ]
      .filter(Boolean)
      .join('\n')

    return telegram.sendMessage(chatId, lines, { parse_mode: 'HTML' })
  } catch {
    return telegram.sendMessage(chatId, '❌ Failed to verify product. Please try again.')
  }
}
