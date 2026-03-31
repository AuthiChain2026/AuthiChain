// ─── AuthiChain Nurture Email Sequences ──────────────────────────────────────
// Each sequence is a series of emails sent automatically based on lead stage.
// Emails are sent via Resend (see lib/emailService.ts) and triggered by Make.com.

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://authichain.com'

export type SequenceId = 'new_lead' | 'pricing_viewer' | 'abandoned_checkout' | 'trial_ending' | 'upsell'

export interface NurtureEmail {
  id: string
  subject: string
  delayDays: number       // Days after sequence start
  delayHours?: number     // Hours after sequence start (for urgent emails)
  html: string
  text: string
}

export interface NurtureSequence {
  id: SequenceId
  name: string
  description: string
  emails: NurtureEmail[]
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
    <p class="muted">&copy; 2026 AuthiChain. <a href="${APP_URL}/pricing" style="color:#a855f7">View plans</a> &middot; <a href="mailto:Z@authichain.com" style="color:#a855f7">Contact us</a></p>
  </div></body></html>`
}

export const SEQUENCES: NurtureSequence[] = [
  {
    id: 'new_lead',
    name: 'New Lead Welcome',
    description: 'Onboarding sequence for new leads who signed up via popup or inline form',
    emails: [
      {
        id: 'new_lead_1',
        subject: 'Welcome to AuthiChain — Your Free Demo Awaits',
        delayDays: 0,
        html: brandWrap(`
          <div class="card">
            <h2 style="margin:0 0 8px">Welcome to AuthiChain</h2>
            <p>Thanks for your interest in blockchain-powered product authentication. Here's what you can do right now:</p>
            <ol style="line-height:2">
              <li><a href="${APP_URL}/demo" style="color:#a855f7">Try the live demo</a> — see AI AutoFlow&trade; classify a product in seconds</li>
              <li><a href="${APP_URL}/onboarding" style="color:#a855f7">Authenticate your first product</a> — it's free</li>
              <li><a href="${APP_URL}/verify" style="color:#a855f7">Verify any product</a> — enter a TrueMark&trade; ID</li>
            </ol>
            <a href="${APP_URL}/onboarding" class="btn">Start Free Authentication &rarr;</a>
          </div>`),
        text: `Welcome to AuthiChain! Try the live demo: ${APP_URL}/demo. Authenticate your first product free: ${APP_URL}/onboarding`,
      },
      {
        id: 'new_lead_2',
        subject: 'How Leading Brands Protect Their Products',
        delayDays: 2,
        html: brandWrap(`
          <div class="card">
            <h2 style="margin:0 0 8px">Product Authentication Across Industries</h2>
            <p>AuthiChain's AI AutoFlow&trade; supports 10 industries with a combined $14T+ market:</p>
            <ul style="line-height:2;color:#94a3b8;">
              <li><strong style="color:#e2e8f0">Luxury Goods ($340B)</strong> — Serial number tracking & provenance</li>
              <li><strong style="color:#e2e8f0">Pharmaceuticals ($1.4T)</strong> — Batch tracking & cold chain monitoring</li>
              <li><strong style="color:#e2e8f0">Electronics ($1.5T)</strong> — IMEI validation & firmware verification</li>
              <li><strong style="color:#e2e8f0">Cannabis ($30B)</strong> — Seed-to-sale compliance tracking</li>
            </ul>
            <p>See how it works for your industry:</p>
            <a href="${APP_URL}/demos" class="btn">View Industry Demos &rarr;</a>
          </div>`),
        text: `AuthiChain covers 10 industries worth $14T+. See demos: ${APP_URL}/demos`,
      },
      {
        id: 'new_lead_3',
        subject: 'Enterprise Case Study: How Global Brands Use AuthiChain',
        delayDays: 5,
        html: brandWrap(`
          <div class="card">
            <h2 style="margin:0 0 8px">Trusted by Enterprise Brands</h2>
            <p>Companies across luxury, pharma, and electronics are using AuthiChain to fight counterfeiting and build consumer trust.</p>
            <div style="background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.2);border-radius:8px;padding:16px;margin:16px 0;">
              <p style="margin:0;font-style:italic;color:#c4b5fd;">"AuthiChain's AI AutoFlow classified our entire product line in minutes. The blockchain verification gives our customers instant confidence."</p>
              <p style="margin:8px 0 0;font-size:12px;color:#94a3b8;">&mdash; Enterprise Authentication Partner</p>
            </div>
            <p>Ready to see what AuthiChain can do for you?</p>
            <a href="${APP_URL}/pricing" class="btn">View Enterprise Plans &rarr;</a>
          </div>`),
        text: `Enterprise brands trust AuthiChain for product authentication. View plans: ${APP_URL}/pricing`,
      },
      {
        id: 'new_lead_4',
        subject: 'Your Free Authentication Expires in 5 Days',
        delayDays: 9,
        html: brandWrap(`
          <div class="card">
            <h2 style="margin:0 0 8px">Don't Lose Your Free Access</h2>
            <p>Your free product authentication demo expires in 5 days. Here's what you'll keep with a paid plan:</p>
            <ul style="line-height:2;color:#94a3b8;">
              <li>Unlimited product authentication</li>
              <li>AI AutoFlow&trade; across all 10 industries</li>
              <li>Blockchain NFT certificates</li>
              <li>Analytics dashboard</li>
            </ul>
            <a href="${APP_URL}/pricing" class="btn">Upgrade Before It Expires &rarr;</a>
          </div>`),
        text: `Your free AuthiChain access expires in 5 days. Upgrade: ${APP_URL}/pricing`,
      },
      {
        id: 'new_lead_5',
        subject: 'Last Chance — Special Offer Inside',
        delayDays: 14,
        html: brandWrap(`
          <div class="card">
            <h2 style="margin:0 0 8px">Final Offer: 25% Off Your First 3 Months</h2>
            <p>Use code <strong style="color:#a855f7">LAUNCH25</strong> at checkout for 25% off any AuthiChain plan for your first 3 months.</p>
            <div style="text-align:center;margin:24px 0;">
              <div style="display:inline-block;background:rgba(168,85,247,0.15);border:2px dashed #a855f7;border-radius:8px;padding:12px 24px;">
                <span style="font-size:24px;font-weight:700;color:#a855f7;">LAUNCH25</span>
              </div>
            </div>
            <a href="${APP_URL}/pricing" class="btn">Claim 25% Off &rarr;</a>
            <p class="muted" style="margin-top:16px">This offer expires in 48 hours.</p>
          </div>`),
        text: `Last chance: use LAUNCH25 for 25% off AuthiChain. ${APP_URL}/pricing`,
      },
    ],
  },
  {
    id: 'pricing_viewer',
    name: 'Pricing Page Follow-up',
    description: 'Sequence for leads who viewed the pricing page but did not start checkout',
    emails: [
      {
        id: 'pricing_1',
        subject: 'Questions About AuthiChain Pricing?',
        delayDays: 0,
        html: brandWrap(`
          <div class="card">
            <h2 style="margin:0 0 8px">Choosing the Right Plan</h2>
            <p>We noticed you were checking out AuthiChain plans. Here's a quick comparison:</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0;">
              <tr style="border-bottom:1px solid #2d2d5e;">
                <td style="padding:8px;color:#94a3b8;">Starter ($299/mo)</td>
                <td style="padding:8px;">500 products, CSV export</td>
              </tr>
              <tr style="border-bottom:1px solid #2d2d5e;">
                <td style="padding:8px;color:#94a3b8;">Pro ($499/mo)</td>
                <td style="padding:8px;">Unlimited products, API access, supply chain</td>
              </tr>
              <tr>
                <td style="padding:8px;color:#94a3b8;">Enterprise ($799/mo)</td>
                <td style="padding:8px;">Everything + custom integrations</td>
              </tr>
            </table>
            <p>Not sure which is right? Reply to this email and we'll help you choose.</p>
            <a href="${APP_URL}/pricing" class="btn">Compare Plans &rarr;</a>
          </div>`),
        text: `Need help choosing an AuthiChain plan? Compare: ${APP_URL}/pricing`,
      },
      {
        id: 'pricing_2',
        subject: 'The ROI of Product Authentication',
        delayDays: 3,
        html: brandWrap(`
          <div class="card">
            <h2 style="margin:0 0 8px">Authentication Pays for Itself</h2>
            <p>Counterfeiting costs brands $500B+ annually. AuthiChain customers see:</p>
            <ul style="line-height:2;">
              <li><strong style="color:#22d3ee">35% reduction</strong> in counterfeit incidents</li>
              <li><strong style="color:#22d3ee">28% increase</strong> in consumer trust</li>
              <li><strong style="color:#22d3ee">3x ROI</strong> within 6 months</li>
            </ul>
            <a href="${APP_URL}/pricing" class="btn">Start Protecting Your Brand &rarr;</a>
          </div>`),
        text: `AuthiChain delivers 3x ROI. Start protecting: ${APP_URL}/pricing`,
      },
      {
        id: 'pricing_3',
        subject: 'Limited Time: 25% Off AuthiChain',
        delayDays: 7,
        html: brandWrap(`
          <div class="card">
            <h2 style="margin:0 0 8px">Exclusive: 25% Off for 3 Months</h2>
            <p>We'd love to have you onboard. Use code <strong style="color:#a855f7">LAUNCH25</strong> for 25% off any plan.</p>
            <a href="${APP_URL}/pricing" class="btn">Activate Discount &rarr;</a>
          </div>`),
        text: `25% off AuthiChain with LAUNCH25. ${APP_URL}/pricing`,
      },
    ],
  },
  {
    id: 'abandoned_checkout',
    name: 'Abandoned Checkout Recovery',
    description: 'Sequence for leads who started checkout but did not complete',
    emails: [
      {
        id: 'abandon_1',
        subject: 'Complete Your AuthiChain Setup',
        delayDays: 0,
        delayHours: 1,
        html: brandWrap(`
          <div class="card">
            <h2 style="margin:0 0 8px">Your Setup is Almost Complete</h2>
            <p>It looks like you started setting up AuthiChain but didn't finish. Your spot is still reserved.</p>
            <a href="${APP_URL}/pricing" class="btn">Complete Setup &rarr;</a>
            <p class="muted" style="margin-top:16px">If you ran into any issues, just reply to this email.</p>
          </div>`),
        text: `Complete your AuthiChain setup: ${APP_URL}/pricing`,
      },
      {
        id: 'abandon_2',
        subject: 'Need Help Deciding?',
        delayDays: 1,
        html: brandWrap(`
          <div class="card">
            <h2 style="margin:0 0 8px">Common Questions, Quick Answers</h2>
            <p><strong>Q: Can I switch plans later?</strong><br/>Yes, upgrade or downgrade anytime.</p>
            <p><strong>Q: Is there a free trial?</strong><br/>The free tier includes 5 product registrations forever.</p>
            <p><strong>Q: How fast is setup?</strong><br/>Under 3 minutes — AI AutoFlow does the work.</p>
            <a href="${APP_URL}/pricing" class="btn">Pick Your Plan &rarr;</a>
          </div>`),
        text: `FAQ about AuthiChain. Get started: ${APP_URL}/pricing`,
      },
      {
        id: 'abandon_3',
        subject: 'Here\'s 10% Off — Just for You',
        delayDays: 3,
        html: brandWrap(`
          <div class="card">
            <h2 style="margin:0 0 8px">10% Off Your First Month</h2>
            <p>We want to make this easy. Use code <strong style="color:#22d3ee">COMEBACK10</strong> at checkout:</p>
            <a href="${APP_URL}/pricing" class="btn">Claim 10% Off &rarr;</a>
            <p class="muted" style="margin-top:16px">Offer valid for 48 hours.</p>
          </div>`),
        text: `10% off AuthiChain with COMEBACK10. ${APP_URL}/pricing`,
      },
    ],
  },
  {
    id: 'upsell',
    name: 'Customer Upsell',
    description: 'Sequence for existing customers to upgrade to higher tiers',
    emails: [
      {
        id: 'upsell_1',
        subject: 'Unlock More with AuthiChain Pro',
        delayDays: 30,
        html: brandWrap(`
          <div class="card">
            <h2 style="margin:0 0 8px">Ready for the Next Level?</h2>
            <p>You've been using AuthiChain successfully. Upgrade to Pro for:</p>
            <ul style="line-height:2;">
              <li>Unlimited product registrations</li>
              <li>Full API access</li>
              <li>Supply chain tracking</li>
              <li>Custom QR branding</li>
            </ul>
            <a href="${APP_URL}/pricing" class="btn">Upgrade to Pro &rarr;</a>
          </div>`),
        text: `Upgrade to AuthiChain Pro: ${APP_URL}/pricing`,
      },
    ],
  },
]

/**
 * Get the next email to send for a contact in a sequence.
 * Returns null if the sequence is complete.
 */
export function getNextEmail(
  sequenceId: SequenceId,
  emailsSent: string[]  // Array of email IDs already sent
): NurtureEmail | null {
  const sequence = SEQUENCES.find(s => s.id === sequenceId)
  if (!sequence) return null

  for (const email of sequence.emails) {
    if (!emailsSent.includes(email.id)) {
      return email
    }
  }
  return null
}

/**
 * Get the appropriate sequence for a lead based on their stage.
 */
export function getSequenceForStage(stage: string): SequenceId | null {
  switch (stage) {
    case 'new_lead':
    case 'lead':
      return 'new_lead'
    case 'pricing_viewed':
      return 'pricing_viewer'
    case 'checkout_abandoned':
      return 'abandoned_checkout'
    case 'customer':
      return 'upsell'
    default:
      return 'new_lead'
  }
}
