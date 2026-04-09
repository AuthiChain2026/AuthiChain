// =============================================================
// QRON ANALYTICS WORKER
// Tracks daily request counts, serves aggregated stats,
// per-date reports, and request tracking via QRON_KV
// Binding: QRON_KV (KV namespace id: 23fbb5cfb110406f8c9ece60075626fc)
// =============================================================

const VERSION = '1.0.0';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
  'Content-Type': 'application/json',
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const method = request.method;

    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    try {
      // GET /health — health check
      if (url.pathname === '/health') {
        return json({
          status: 'ok',
          worker: 'qron-analytics',
          version: VERSION,
          timestamp: new Date().toISOString(),
          kv_bound: !!env.QRON_KV,
        });
      }

      // GET /stats — aggregated stats from QRON_KV
      if (url.pathname === '/stats' && method === 'GET') {
        return await handleStats(env);
      }

      // GET /daily/:date — daily report for a specific date (YYYY-MM-DD)
      const dailyMatch = url.pathname.match(/^\/daily\/(\d{4}-\d{2}-\d{2})$/);
      if (dailyMatch && method === 'GET') {
        return await handleDailyReport(env, dailyMatch[1]);
      }

      // POST /track — increment request counter for today
      if (url.pathname === '/track' && method === 'POST') {
        return await handleTrack(request, env, ctx);
      }

      // GET / — worker info
      if (url.pathname === '/') {
        return json({
          worker: 'qron-analytics',
          version: VERSION,
          endpoints: {
            'GET /health': 'Health check',
            'GET /stats': 'Aggregated stats from KV',
            'GET /daily/:date': 'Daily report for YYYY-MM-DD',
            'POST /track': 'Increment request counter',
          },
        });
      }

      return json({ error: 'Not found', path: url.pathname }, 404);
    } catch (err) {
      console.error('Analytics worker error:', err.message, err.stack);
      return json({ error: 'Internal server error', message: err.message }, 500);
    }
  },
};

// =============================================================
// GET /stats — aggregated stats
// =============================================================
async function handleStats(env) {
  if (!env.QRON_KV) {
    return json({ error: 'QRON_KV binding not configured' }, 503);
  }

  const today = todayStr();
  const yesterday = dateStr(-1);
  const last7 = Array.from({ length: 7 }, (_, i) => dateStr(-i));

  // Fetch in parallel
  const [
    todayCount,
    yesterdayCount,
    qrTotal,
    tokenPrice,
    lastRun,
    ...weekCounts
  ] = await Promise.all([
    env.QRON_KV.get(`analytics:requests:${today}`),
    env.QRON_KV.get(`analytics:requests:${yesterday}`),
    env.QRON_KV.get('qr:total_count'),
    env.QRON_KV.get('token:price', 'json'),
    env.QRON_KV.get('cron:last_run_timestamp'),
    ...last7.map(d => env.QRON_KV.get(`analytics:requests:${d}`)),
  ]);

  const weeklyTotal = weekCounts.reduce((sum, v) => sum + parseInt(v || '0'), 0);

  return json({
    worker: 'qron-analytics',
    version: VERSION,
    timestamp: new Date().toISOString(),
    today: {
      date: today,
      requests: parseInt(todayCount || '0'),
    },
    yesterday: {
      date: yesterday,
      requests: parseInt(yesterdayCount || '0'),
    },
    weekly: {
      total_requests: weeklyTotal,
      days: last7.map((d, i) => ({
        date: d,
        requests: parseInt(weekCounts[i] || '0'),
      })),
    },
    totals: {
      qr_codes_generated: parseInt(qrTotal || '0'),
    },
    token: tokenPrice || null,
    cron: {
      last_run: lastRun || null,
    },
  });
}

// =============================================================
// GET /daily/:date — daily report for a specific date
// =============================================================
async function handleDailyReport(env, date) {
  if (!env.QRON_KV) {
    return json({ error: 'QRON_KV binding not configured' }, 503);
  }

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return json({ error: 'Invalid date format. Use YYYY-MM-DD' }, 400);
  }

  const [preAggregated, requestCount] = await Promise.all([
    env.QRON_KV.get(`analytics:daily:${date}`, 'json'),
    env.QRON_KV.get(`analytics:requests:${date}`),
  ]);

  if (preAggregated) {
    return json({ source: 'aggregated', date, ...preAggregated });
  }

  // Fall back to live counter
  const requests = parseInt(requestCount || '0');
  return json({
    source: 'live',
    date,
    requests,
    note: requests === 0
      ? 'No data for this date or cron has not yet aggregated it'
      : 'Live counter (cron aggregation pending)',
    timestamp: new Date().toISOString(),
  });
}

// =============================================================
// POST /track — increment today's request counter
// =============================================================
async function handleTrack(request, env, ctx) {
  if (!env.QRON_KV) {
    return json({ error: 'QRON_KV binding not configured' }, 503);
  }

  let body = {};
  try {
    body = await request.json();
  } catch (_) {
    // body is optional
  }

  const today = todayStr();
  const key = `analytics:requests:${today}`;

  // Increment atomically (best-effort — KV has no atomic increment)
  const current = parseInt(await env.QRON_KV.get(key) || '0');
  const next = current + 1;

  // Write asynchronously so we don't block the response
  ctx.waitUntil(
    env.QRON_KV.put(key, String(next), { expirationTtl: 172800 }) // 48h TTL
  );

  return json({
    success: true,
    date: today,
    requests: next,
    source: body.source || 'unknown',
    timestamp: new Date().toISOString(),
  });
}

// =============================================================
// HELPERS
// =============================================================
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function dateStr(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: CORS_HEADERS,
  });
}
