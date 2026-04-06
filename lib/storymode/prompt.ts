import { StorymodeContext } from './types';

/**
 * Build the GPT prompt for Storymode narrative generation.
 */
export function buildStoryPrompt(ctx: StorymodeContext): string {
  const { product, verification, qron, tone, story_type } = ctx;

  const productInfo = product
    ? `Product: ${product.name || 'Unknown'}\nBrand: ${product.brand || 'Unknown'}\nIndustry: ${product.industry_id || 'Unknown'}\nSKU: ${product.sku || 'N/A'}`
    : 'Product details unavailable.';

  const verificationInfo = verification?.length
    ? `Verification events (${verification.length}):\n${verification.map((v: any, i: number) => `  ${i + 1}. ${v.event_type || 'scan'} at ${v.created_at || 'unknown time'}`).join('\n')}`
    : 'No verification events yet.';

  const qronInfo = qron
    ? `QRON Art: Signed with Ed25519, QRON ID ${qron.id || 'N/A'}`
    : 'No QRON art attached.';

  return `Tell the ${story_type} story of this product in a ${tone} tone.

${productInfo}

${verificationInfo}

${qronInfo}

Write a compelling narrative (2-4 paragraphs) about this product's journey from creation to authentication on the AuthiChain Protocol. Include details about its provenance, verification history, and what makes it authentic.`;
}
