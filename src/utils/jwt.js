import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";
const DEFAULT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

/**
 * generateToken
 * @param {Object} payload - object to embed in the token
 * @param {string} [expiresIn] - optional expiresIn value (e.g. '1d', '2h')
 * @returns {string} signed JWT
 */
export function generateToken(payload, expiresIn = DEFAULT_EXPIRES_IN) {
  if (!payload || typeof payload !== "object") {
    throw new TypeError("payload must be an object");
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * verifyToken
 * @param {string} token - JWT string
 * @returns {Object} decoded payload
 * @throws {Error} when token is invalid or expired
 */
export function verifyToken(token) {
  if (!token || typeof token !== "string") {
    throw new TypeError("token must be a non-empty string");
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    const e = new Error("Invalid or expired token");
    e.cause = err;
    throw e;
  }
}
