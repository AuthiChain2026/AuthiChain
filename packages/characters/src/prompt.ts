export type Archetype =
  | 'Guardian'
  | 'Archivist'
  | 'Sentinel'
  | 'Scout'
  | 'Arbiter'
  | 'Merchant'
  | 'Explorer';

export interface CharacterPromptInput {
  archetype: Archetype;
  roleSummary?: string;
  colorway?: string;
  mood?: string;
  objectContext?: string;
  brandContext?: string;
  style?: string;
}

export interface BuiltPrompt {
  prompt: string;
  negativePrompt: string;
}

const DEFAULT_ROLE_SUMMARY: Record<Archetype, string> = {
  Guardian: 'protects authenticity and shields verified value',
  Archivist: 'records provenance, origin, and historical truth',
  Sentinel: 'watches for anomalies, counterfeit signals, and network abuse',
  Scout: 'discovers objects, listings, and verification opportunities',
  Arbiter: 'judges conflicting signals and helps finalize consensus',
  Merchant: 'represents trusted trade, verified ownership, and value exchange',
  Explorer: 'unlocks engagement through scans, discovery, and movement across the network'
};

export function buildOpenArtPrompt(input: CharacterPromptInput): BuiltPrompt {
  const roleSummary = input.roleSummary ?? DEFAULT_ROLE_SUMMARY[input.archetype];
  const colorway = input.colorway ?? 'graphite black, polished silver, neon blue, restrained gold accents';
  const mood = input.mood ?? 'confident, intelligent, premium, trustworthy';
  const objectContext = input.objectContext ?? 'general high-value authenticated objects';
  const brandContext = input.brandContext ?? 'AuthiChain, a proof-of-authenticity protocol where truth has tradeable value';
  const style = input.style ?? 'premium futuristic heraldic concept art';

  const prompt = `Create an AuthiCharacter for AuthiChain.

Archetype: ${input.archetype}
Role: ${roleSummary}
Colorway: ${colorway}
Mood: ${mood}
Object context: ${objectContext}
Brand context: ${brandContext}
Style: ${style}

Visual direction:
A premium futuristic heraldic character representing ${input.archetype} within a proof-of-authenticity network. The design must express verification, trust, provenance, protection, intelligence, and digital value. Strong silhouette, iconic chest insignia, elegant material rendering, clean composition, and mint-worthy detail. High-end concept art quality. Suitable for collectible identity, protocol badge, dashboard avatar, and AI verification agent persona.

Composition requirements:
centered portrait, high face-or-helmet clarity, premium materials, subtle luminous accents, restrained background, cinematic studio lighting, no text, no watermark, highly readable at thumbnail size.

Output requirements:
high resolution, vertical portrait, polished finish, premium contrast, mint-ready, no background clutter.`;

  const negativePrompt = [
    'low quality',
    'blurry',
    'muddy contrast',
    'cluttered background',
    'text',
    'watermark',
    'duplicate limbs',
    'bad hands',
    'deformed anatomy',
    'generic fantasy',
    'childish mascot',
    'goofy meme energy',
    'over-sexualized styling',
    'noisy composition'
  ].join(', ');

  return { prompt, negativePrompt };
}
