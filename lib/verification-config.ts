const configuredVerifyApiUrl = process.env.VERIFY_API_URL?.trim();

export function getVerifyApiUrl() {
  return configuredVerifyApiUrl || null;
}

export function getVerifyApiMissingMessage() {
  return "VERIFY_API_URL is not configured. Set it to your live verification service on qron.space or another active backend you control.";
}
