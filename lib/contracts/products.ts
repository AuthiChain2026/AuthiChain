import { z } from "zod";

const nullableString = z.string().nullable().optional().transform((value) => value ?? null);

export const workflowStepSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  duration: z.string(),
});

const stringArraySchema = z.array(z.string()).nullable().optional().transform((value) => value ?? []);
const workflowSchema = z.array(workflowStepSchema).nullable().optional().transform((value) => value ?? []);

export const productSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  name: z.string(),
  description: nullableString,
  category: nullableString,
  brand: nullableString,
  image_url: nullableString,
  truemark_id: nullableString,
  truemark_data: z.unknown().nullable().optional().transform((value) => value ?? null),
  blockchain_tx_hash: nullableString,
  is_registered: z.boolean(),
  industry_id: nullableString,
  workflow: workflowSchema,
  story: nullableString,
  features: stringArraySchema,
  authenticity_features: stringArraySchema,
  confidence: z.number().int().nullable().optional().transform((value) => value ?? null),
  created_at: z.string(),
  updated_at: z.string(),
});

export const createProductInputSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  description: z.string().trim().optional().nullable(),
  category: z.string().trim().optional().nullable(),
  brand: z.string().trim().optional().nullable(),
  imageUrl: z.string().url("Product image URL is invalid").optional().nullable(),
  industryId: z.string().trim().optional().nullable(),
  workflow: z.array(workflowStepSchema).optional().nullable(),
  story: z.string().trim().optional().nullable(),
  features: z.array(z.string()).optional().nullable(),
  authenticityFeatures: z.array(z.string()).optional().nullable(),
  confidence: z.number().int().min(0).max(100).optional().nullable(),
});

export const productsResponseSchema = z.object({
  products: z.array(productSchema),
});

export const productResponseSchema = z.object({
  product: productSchema,
  warning: z.string().optional(),
});

export const registerProductResponseSchema = z.object({
  success: z.boolean(),
  product: productSchema,
  message: z.string(),
});

export type Product = z.infer<typeof productSchema>;
export type CreateProductInput = z.infer<typeof createProductInputSchema>;
export type ProductsResponse = z.infer<typeof productsResponseSchema>;
export type ProductResponse = z.infer<typeof productResponseSchema>;
export type RegisterProductResponse = z.infer<typeof registerProductResponseSchema>;

export function normalizeProductRecord(input: unknown): Product {
  return productSchema.parse(input);
}

export function normalizeProductList(input: unknown): Product[] {
  return z.array(productSchema).parse(input);
}

