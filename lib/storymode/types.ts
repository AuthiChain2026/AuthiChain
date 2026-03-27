import { z } from 'zod';

export const StorymodeInputSchema = z.object({
  product_id: z.string(),
  tone: z.string().default('cinematic'),
  story_type: z.string().default('provenance')
});

export type StorymodeInput = z.infer<typeof StorymodeInputSchema>;

export interface StorymodeContext {
  product: any;
  verification: any[];
  qron: any | null;
  tone: string;
  story_type: string;
}
