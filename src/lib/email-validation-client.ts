/**
 * Client-side email validation (same regex as server).
 */
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function isValidEmail(value: string): boolean {
  if (!value || typeof value !== "string") return false;
  const trimmed = value.trim();
  if (trimmed.length > 254) return false;
  return EMAIL_REGEX.test(trimmed);
}
