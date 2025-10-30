import { header, validationResult } from "express-validator";

/**
 * Middleware: Validate presence of an authentication token in headers.
 * Supports:
 *   - Authorization: Bearer <token>
 *   - token: <token>
 *   - x-access-token: <token>
 */
export const validateAuthHeader = [
  header("authorization")
    .exists()
    .withMessage("Missing Authorization header")
    .isString()
    .withMessage("Authorization header must be a string")
    .custom((value, { req }) => {
      const bearerFormat = /^Bearer\s+\S+$/i.test(value || "");

      // Allow either Bearer token or fallback headers
      if (bearerFormat) return true;

      const fallbackToken = req.get("token") || req.get("x-access-token");
      if (!fallbackToken) {
        throw new Error(
          "Authentication token missing (expected 'Authorization: Bearer <token>' or 'token'/'x-access-token' headers)"
        );
      }

      return true;
    })
    .bail(),
];
