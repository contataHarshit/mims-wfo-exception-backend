// utils/redactUtils.js

/**
 * Redacts sensitive fields from an object for safe logging.
 * @param {Object} obj - The object to redact.
 * @param {string[]} [keysToRedact] - Optional custom list of keys to redact.
 * @returns {Object} - A new object with sensitive fields redacted.
 */
export const redact = (
  obj,
  keysToRedact = ["password", "pwd", "token", "jwt", "authorization"]
) => {
  if (!obj || typeof obj !== "object") return obj;

  const copy = { ...obj };
  keysToRedact.forEach((key) => {
    if (key in copy) {
      copy[key] = "[REDACTED]";
    }
  });

  return copy;
};
