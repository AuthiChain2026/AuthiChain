import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM = process.env.EMAIL_FROM || 'AuthiChain <noreply@authichain.com>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://authichain.com'

async function send(to: string, subject: string, html: string) {
  if (!resend) {
    console.log('[emailService] RESEND_API_KEY not set — skipping email:', subject, '->', to)
    return
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html })
    console.log('[emailService] Sent:', subject, '->', to)
  } catch (err) {
    console.error('[emailService] Send failed:', err)
  }
}

function brandWrap(body: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body{font-family:Inter,sans-serif;background:#0f0f0f;color:#e2e8f0;margin:0;padding:0}
    .wrap{max-width:600px;margin:0 auto;padding:40px 24px}
    .logo{font-size:24px;font-weight:700;background:linear-gradient(135deg,#a855f7,#22d3ee);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    .card{background:#1a1a2e;border:1px solid #2d2d5e;border-radius:12px;padding:32px;margin:24px 0}
    .btn{display:inline-block;background:linear-gradient(135deg,#a855f7,#22d3ee);color:#fff!important;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;margin-top:16px}
    .muted{color:#94a3b8;font-size:14px}
    .divider{border:none;border-top:1px solid #2d2d5e;margin:24px 0}
  </style></head><body><div class="wrap">
    <div class="logo">AuthiChain</div>
    ${body}
    <hr class="divider">
    <p class="muted">© ${new Date().getFullYear()} AuthiChain. <a href="${APP_URL}/pricing" style="color:#a855f7">Manage subscription</a></p>
  </div></body></html>`
}

export async function sendWelcomeEmail(to: string, plan: string, name?: string) {
  const greeting = name ? `Hi ${name},` : 'Welcome,'
  const html = brandWrap(`
    <div class="card">
      <h2 style="margin:0 0 8px">🎉 Welcome to AuthiChain ${plan}!</h2>
      <p>${greeting} Your subscription is active. Here's how to get started:</p>
      <ol style="line-height:2">
        <li><a href="${APP_URL}/dashboard" style="color:#a855f7">Go to your Dashboard</a> — register your first product</li>
        <li><a href="${APP_URL}/upload" style="color:#a855f7">Upload a product</a> — AI classifies it in seconds</li>
        <li>Share your TrueMark™ QR code — customers verify authenticity instantly</li>
      </ol>
      <a href="${APP_URL}/dashboard" class="btn">Open Dashboard →</a>
    </div>`)
  await send(to, `Welcome to AuthiChain ${plan} — You're all set!`, html)
}

export async function sendUpgradeEmail(to: string, oldPlan: string, newPlan: string) {
  const html = brandWrap(`
    <div class="card">
      <h2 style="margin:0 0 8px">⬆️ Plan Upgraded to ${newPlan}</h2>
      <p>You've successfully upgraded from <strong>${oldPlan}</strong> to <strong>${newPlan}</strong>. Your new limits and features are active immediately.</p>
      <a href="${APP_URL}/dashboard" class="btn">Explore New Features →</a>
    </div>`)
  await send(to, `You've upgraded to AuthiChain ${newPlan}`, html)
}

export async function sendPaymentFailedEmail(to: string, portalUrl?: string) {
  const portal = portalUrl || `${APP_URL}/api/billing-portal`
  const html = brandWrap(`
    <div class="card" style="border-color:#ef4444">
      <h2 style="margin:0 0 8px;color:#ef4444">⚠️ Payment Failed</h2>
      <p>We couldn't process your latest AuthiChain payment. To keep your products authenticated and your subscription active, please update your payment method.</p>
      <a href="${portal}" class="btn" style="background:#ef4444">Update Payment Method →</a>
      <p class="muted" style="margin-top:16px">Your account will remain active for 7 days while we retry the payment.</p>
    </div>`)
  await send(to, 'Action required: AuthiChain payment failed', html)
}

export async function sendTrialEndingEmail(to: string, daysLeft: number, plan: string) {
  const html = brandWrap(`
    <div class="card">
      <h2 style="margin:0 0 8px">⏰ Your trial ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}</h2>
      <p>Your AuthiChain <strong>${plan}</strong> trial is almost over. Don't lose access to your authenticated products — subscribe now and keep everything running.</p>
      <a href="${APP_URL}/pricing" class="btn">Continue with ${plan} →</a>
      <p class="muted" style="margin-top:16px">No credit card surprises — you chose ${plan} at checkout.</p>
    </div>`)
  await send(to, `Your AuthiChain trial ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`, html)
}

export async function sendRenewalEmail(to: string, plan: string, amount: string) {
  const html = brandWrap(`
    <div class="card">
      <h2 style="margin:0 0 8px">✅ Subscription Renewed</h2>
      <p>Your AuthiChain <strong>${plan}</strong> subscription has been renewed successfully for <strong>${amount}</strong>. Thank you!</p>
      <a href="${APP_URL}/dashboard" class="btn">View Dashboard →</a>
    </div>`)
  await send(to, `AuthiChain ${plan} renewed — thank you!`, html)
}
