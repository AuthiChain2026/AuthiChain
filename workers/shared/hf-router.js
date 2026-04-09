/**
 * HuggingFace Inference Router Update — Apr 9 2026
 * 
 * OLD (DEAD — returns 410):
 *   https://api-inference.huggingface.co/models/{model}
 *
 * NEW ROUTER options (both confirmed working):
 * 
 * Option A: Novita (fast, free tier, OpenAI-compatible)
 *   POST https://router.huggingface.co/novita/v3/openai/chat/completions
 *   Headers: { Authorization: "Bearer {HF_KEY}", Content-Type: "application/json" }
 *   Body: { model: "qwen/qwen2.5-7b-instruct", messages: [...], max_tokens: N }
 *   ⚠️  Model IDs must be LOWERCASE for Novita
 *
 * Option B: Featherless (OpenAI-compatible, standard HF model IDs)
 *   POST https://router.huggingface.co/featherless-ai/v1/chat/completions
 *   Headers: { Authorization: "Bearer {HF_KEY}", Content-Type: "application/json" }
 *   Body: { model: "Qwen/Qwen2.5-7B-Instruct", messages: [...], max_tokens: N }
 *
 * Replace all usages in:
 *   - qron-ai-api worker
 *   - qron-flexible-generator worker
 *   - any Supabase edge fn calling HF
 */

// Helper: drop-in replacement for old HF inference calls
async function callHFRouter(hfKey, prompt, opts = {}) {
  const provider = opts.provider || 'featherless-ai';
  const model = opts.model || 'Qwen/Qwen2.5-7B-Instruct';
  const maxTokens = opts.maxTokens || 200;

  const URLS = {
    'featherless-ai': 'https://router.huggingface.co/featherless-ai/v1/chat/completions',
    'novita': 'https://router.huggingface.co/novita/v3/openai/chat/completions',
  };

  const r = await fetch(URLS[provider], {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${hfKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
    }),
  });

  const d = await r.json();
  return d.choices?.[0]?.message?.content || '';
}

export { callHFRouter };
