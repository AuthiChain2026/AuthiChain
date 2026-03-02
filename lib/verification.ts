export type VerifyPayload = {
  productIdentifier?: string
  tokenId?: number
  qrCode?: string
}

type VerifyApiProduct = {
  productIdentifier?: string
  isActive?: boolean
}

type VerifyApiResponse = {
  success?: boolean
  message?: string
  product?: VerifyApiProduct | null
  supplyChain?: unknown
  tokenId?: number
}

export function isLikelyUrl(value: string): boolean {
  return /^https?:\/\//i.test(value)
}

export function normalizeProductIdentifier(value: string): string {
  return value.trim().toUpperCase()
}

export function buildVerifyPayload(rawInput: string): VerifyPayload {
  const raw = rawInput.trim()

  // URL: extract ?id= param first, then fall back to path segment
  if (isLikelyUrl(raw)) {
    try {
      const parsed = new URL(raw)
      const idParam = parsed.searchParams.get('id')
      if (idParam) {
        return { productIdentifier: normalizeProductIdentifier(idParam) }
      }
    } catch {
      // fall through
    }
    return { qrCode: raw }
  }

  // PROD-* or TM-* identifiers (product IDs and TrueMark IDs)
  if (
    /^PROD-/i.test(raw) ||
    /^TM-/i.test(raw) ||
    /^[A-Z]{2,}-[A-Z0-9-]+$/i.test(raw)
  ) {
    return { productIdentifier: normalizeProductIdentifier(raw) }
  }

  // Numeric token ID
  if (/^\d+$/.test(raw)) {
    return { tokenId: Number(raw) }
  }

  return { qrCode: raw }
}

function deriveInputIdentifier(input: string): string {
  const trimmed = input.trim()
  if (!isLikelyUrl(trimmed)) {
    return normalizeProductIdentifier(trimmed)
  }
  try {
    const parsed = new URL(trimmed)
    // Prefer ?id= query param — this is the canonical QRON QR code format
    const idParam = parsed.searchParams.get('id')
    if (idParam) {
      return normalizeProductIdentifier(idParam)
    }
    const pathParts = parsed.pathname.split('/').filter(Boolean)
    const lastSegment = pathParts[pathParts.length - 1]
    return normalizeProductIdentifier(lastSegment || trimmed)
  } catch {
    return normalizeProductIdentifier(trimmed)
  }
}

export type VerificationViewModel = {
  result: 'authentic' | 'counterfeit'
  authentic: Boolean
  trust_score: number
  confidence: 'High' | 'Medium' | 'Low'
  qron_id: string
  actions: string[]
  product: VerifyApiProduct | null
  supplyChain: unknown
  tokenId: number | null
  success: boolean
  message: string
  verifiedAt: string
  input: string
}

export function mapVerificationResponse(data: VerifyApiResponse, input: string): VerificationViewModel {
  const authentic = data?.success
