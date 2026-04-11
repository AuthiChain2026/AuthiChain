export interface OpenArtGenerateRequest {
  prompt: string;
  negativePrompt?: string;
  numImages?: number;
  size?: '1024x1024' | '1024x1536' | '1536x1024';
  transparentBackground?: boolean;
  model?: string;
}

export interface OpenArtGeneratedAsset {
  id: string;
  imageUrl: string;
  previewUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface OpenArtGenerateResponse {
  requestId: string;
  assets: OpenArtGeneratedAsset[];
  raw: unknown;
}

export class OpenArtClient {
  constructor(
    private readonly apiKey: string,
    private readonly baseUrl: string = 'https://openart-api.example.com/v1'
  ) {}

  async generate(req: OpenArtGenerateRequest): Promise<OpenArtGenerateResponse> {
    const response = await fetch(`${this.baseUrl}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        prompt: req.prompt,
        negative_prompt: req.negativePrompt,
        num_images: req.numImages ?? 4,
        size: req.size ?? '1024x1536',
        transparent_background: req.transparentBackground ?? false,
        model: req.model ?? 'openart-default'
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`OpenArt generate failed: ${response.status} ${text}`);
    }

    const raw = await response.json();
    const assets: OpenArtGeneratedAsset[] = (raw.data?.images ?? raw.images ?? []).map((img: any, idx: number) => ({
      id: img.id ?? `${raw.id ?? 'gen'}-${idx}`,
      imageUrl: img.url ?? img.image_url,
      previewUrl: img.preview_url ?? img.thumbnail_url,
      metadata: img
    }));

    return {
      requestId: raw.id ?? crypto.randomUUID(),
      assets,
      raw
    };
  }
}
