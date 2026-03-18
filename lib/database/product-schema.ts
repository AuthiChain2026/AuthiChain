const LEGACY_AI_COLUMNS = [
  "industry_id",
  "workflow",
  "story",
  "features",
  "authenticity_features",
  "confidence",
] as const;

type ErrorLike = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

function stringifyError(error: ErrorLike | null | undefined) {
  return [error?.code, error?.message, error?.details, error?.hint]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function isLegacyProductsSchemaError(error: ErrorLike | null | undefined) {
  const text = stringifyError(error);

  if (!text) {
    return false;
  }

  return (
    LEGACY_AI_COLUMNS.some((column) => text.includes(column)) ||
    text.includes("schema cache") ||
    text.includes("could not find the") ||
    text.includes("column")
  );
}

export const LEGACY_PRODUCTS_SCHEMA_WARNING =
  "Database schema is missing AI AutoFlow columns. Run supabase/migrations/add_ai_autoflow_fields.sql to fully enable synced product metadata.";

