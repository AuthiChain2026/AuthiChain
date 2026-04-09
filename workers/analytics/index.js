// =============================================================
// QRON ANALYTICS WORKER
// Tracks and serves analytics data for the qron.space ecosystem
// Bindings: QRON_KV
// =============================================================

const VERSION = '1.0.0';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS headers
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    };

    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    const respond = (data, status = 200) =>
      new Response(JSON.stringify(data, null, 2), { status, headers });

    try {
      // ── Health ───────────────────────────────────────────
      if (path === '/' || path === '/health') {
        return respond({
          worker: 'qron-analytics',
          version: VERSION,
          status: 'ok',
          timestamp: new Date().toISOString(),
          endpoints: ['/health', '/stats', '/track', '/daily/:date'],
        });
      }

      // ── Track an event (POST /track) ─────────────────────
      if (path === '/track' && method === 'POST') {
        const today = new Date().toISOString().slice(0, 10);
        const body = await request.json().catch(() => ({}));
        const event = body.event || 'pageview';

        if (env.QRON_KV) {
          // Increment total events counter
          const totalKey = `analytics:total:${event}`;
          const dailyKey = `analytics:daily:${today}:${event}`;
          const requestKey = `analytics:requests:${today}`;

          const [total, daily, reqCount] = await Promise.all([
            env.QRON_KV.get(totalKey),
            env.QRON_KV.get(dailyKey),
            env.QRON_KV.get(requestKey),
          ]);

          await Promise.all([
            env.QRON_KV.put(totalKey, String(parseInt(total || '0') + 1)),
            env.QRON_KV.put(dailyKey, String(parseInt(daily || '0') + 1), { expirationTtl: 2592000 }),
            env.QRON_KV.put(requestKey, String(parseInt(reqCount || '0') + 1), { expirationTtl: 2592000 }),
          ]);

          return respond({ success: true, event, date: today });
        }
        return respond({ success: false, error: 'KV not configured' }, 503);
      }

      // ── Daily stats (GET /daily/:date) ───────────────────
      if (path.startsWith('/daily/')) {
        const date = path.split('/daily/')[1];
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return respond({ error: 'Invalid date format. Use YYYY-MM-DD' }, 400);
        }

        if (!env.QRON_KV) return respond({ error: 'KV not configured' }, 503);

        const [requests, pageviews, qrCodes, checkouts] = await Promise.all([
          env.QRON_KV.get(`analytics:requests:${date}`),
          env.QRON_KV.get(`analytics:daily:${date}:pageview`),
          env.QRON_KV.get(`analytics:daily:${date}:qr_generate`),
          env.QRON_KV.get(`analytics:daily:${date}:checkout`),
        ]);

        return respond({
          date,
          requests: parseInt(requests || '0'),
          events: {
            pageviews: parseInt(pageviews || '0'),
            qr_generated: parseInt(qrCodes || '0'),
            checkouts: parseInt(checkouts || '0'),
          },
        });
      }

      // ── Overall stats (GET /stats) ───────────────────────
      if (path === '/stats') {
        if (!env.QRON_KV) return respond({ error: 'KV not configured' }, 503);

        const today = new Date().toISOString().slice(0, 10);
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

        const [
          totalPageviews,
          totalQR,
          totalCheckouts,
          todayRequests,
          yesterdayRequests,
          lastCronRun,
          tokenPrice,
          qrCount,
        ] = await Promise.all([
          env.QRON_KV.get('analytics:total:pageview'),
          env.QRON_KV.get('analytics:total:qr_generate'),
          env.QRON_KV.get('analytics:total:checkout'),
          env.QRON_KV.get(`analytics:requests:${today}`),
          env.QRON_KV.get(`analytics:requests:${yesterday}`),
          env.QRON_KV.get('cron:last_run_timestamp'),
          env.QRON_KV.get('token:price', 'json'),
          env.QRON_KV.get('qr:total_count'),
        ]);

        return respond({
          worker: 'qron-analytics',
          version: VERSION,
          timestamp: new Date().toISOString(),
          totals: {
            pageviews: parseInt(totalPageviews || '0'),
            qr_generated: parseInt(qrCount || totalQR || '0'),
            checkouts: parseInt(totalCheckouts || '0'),
          },
          today: {
            date: today,
            requests: parseInt(todayRequests || '0'),
          },
          yesterday: {
            date: yesterday,
            requests: parseInt(yesterdayRequests || '0'),
          },
          ecosystem: {
            last_cron_run: lastCronRun || null,
            token_price: tokenPrice || null,
          },
        });
      }

      return respond({ error: 'Not found', path }, 404);
    } catch (err) {
      console.error('Analytics worker error:', err.message, err.stack);
      return respond({ error: 'Internal server error', message: err.message }, 500);
    }
  },
};
