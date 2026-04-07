// outreach-queue-worker v1.0
// Reads pending emails from D1 outreach_queue and sends via Resend
// Triggered manually via /send or via cron (add when cron slot available)

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const auth = req.headers.get('x-api-key');
    if (auth !== env.INTERNAL_API_KEY) {
      return Response.json({ error: 'unauthorized' }, { status: 401 });
    }

    if (url.pathname === '/send' && req.method === 'POST') {
      return sendPendingEmails(env);
    }
    if (url.pathname === '/queue' && req.method === 'GET') {
      const rows = await env.DB.prepare(
        "SELECT id, campaign, to_email, subject, status, scheduled_at, sent_at FROM outreach_queue ORDER BY created_at DESC LIMIT 100"
      ).all();
      return Response.json(rows.results);
    }
    return Response.json({ worker: 'outreach-queue-worker', endpoints: ['/send (POST)', '/queue (GET)'] });
  },

  async scheduled(event, env) {
    return sendPendingEmails(env);
  }
};

async function sendPendingEmails(env) {
  const pending = await env.DB.prepare(
    "SELECT * FROM outreach_queue WHERE status='pending' AND scheduled_at <= datetime('now') LIMIT 10"
  ).all();

  const results = [];
  for (const email of pending.results) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'hello@qron.space',
          reply_to: 'authichain@gmail.com',
          to: [email.to_email],
          subject: email.subject,
          html: email.html_body
        })
      });
      const data = await res.json();

      if (data.id) {
        await env.DB.prepare(
          "UPDATE outreach_queue SET status='sent', sent_at=datetime('now') WHERE id=?"
        ).bind(email.id).run();
        results.push({ id: email.id, campaign: email.campaign, status: 'sent', resend_id: data.id });
      } else {
        await env.DB.prepare(
          "UPDATE outreach_queue SET status='failed' WHERE id=?"
        ).bind(email.id).run();
        results.push({ id: email.id, campaign: email.campaign, status: 'failed', error: data.message });
      }
    } catch (err) {
      results.push({ id: email.id, campaign: email.campaign, status: 'error', error: err.message });
    }
  }

  return Response.json({ sent: results.length, results });
}
