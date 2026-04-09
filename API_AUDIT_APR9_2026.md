# API Audit — April 9, 2026

## Key Findings

### ✅ HuggingFace (FIXED)
- **New key**: `[REDACTED]` — confirmed valid
- **Old key revoked**: `[REDACTED]`
- **CRITICAL**: `api-inference.huggingface.co` → **DEAD (410 Gone)**
- **New router**:
  - Novita: `https://router.huggingface.co/novita/v3/openai/chat/completions`
  - Featherless: `https://router.huggingface.co/featherless-ai/v1/chat/completions`
- Both confirmed working (HTTP 200)

### ✅ Etherscan / PolygonScan (MIGRATED)
- V1 (`api.polygonscan.com/api`) → **DEPRECATED** (returns migration warning)
- **V2**: `https://api.etherscan.io/v2/api?chainid=137&apikey={key}`
- All 3 keys confirmed working on V2
- **QRON supply confirmed**: 1,000,000,000 $QRON

### ✅ All Other Keys (Passing)
| Service | Status |
|---|---|
| Groq | ✅ 200 OK |
| Resend | ✅ 200 OK |
| GitHub PAT | ✅ 200 OK |
| Supabase Management | ✅ Active |
| Stripe (webhook secrets) | ✅ Configured |

## Free APIs Integrated (No Billing)

### AI / LLM
| Provider | Free Tier | Use Case |
|---|---|---|
| HF Router/Featherless | Free | QR art prompts, product descriptions |
| HF Router/Novita | Free | Chat completions |
| Groq (existing) | 14,400 req/day | Daily ops insights |
| OpenRouter :free models | 28 models free | Fallback LLM |
| CF Workers AI | 10k neurons/day | On-edge inference |

### Blockchain / Data
| Provider | Free Tier | Use Case |
|---|---|---|
| Etherscan V2 | Free with key | QRON/NFT supply, transfers |
| Polygon RPC | Keyless | Block queries, tx status |
| CoinGecko | 30 req/min keyless | MATIC/token prices |

### Utility
| Provider | Free Tier | Use Case |
|---|---|---|
| QR Server API | Keyless, unlimited | Fallback QR generation |
| Open-Meteo | Keyless | Weather for location features |
| ipapi.co | 1000/day keyless | Geolocation for scan events |
| ExchangeRate API | Keyless | USD/currency conversion |
