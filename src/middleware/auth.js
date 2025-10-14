import { verifyToken } from "../utils/jwt.js";
import logger from "../utils/logger.js";

export default function authMiddleware(req, res, next) {
  try {
    // Use case-insensitive header getter
    const authHeader = req.get("Authorization") || req.get("authorization");
    let token = null;

    if (authHeader && typeof authHeader === "string") {
      const parts = authHeader.split(" ");
      if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
        token = parts[1];
      }
    }

    // fallback to plain `token` or `x-access-token` headers
    if (!token) {
      token = req.get("token") || req.get("x-access-token");
    }

    if (!token) {
      logger.warn("Missing authentication token");
      console.log("Missing authentication token");
      return res.status(401).json({ error: "Missing authentication token" });
    }

    let payload;
    try {
      payload = verifyToken(token);
    } catch (err) {
      logger.warn("Invalid token", { error: err.message });
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const { employeeId, employeeNumber, name } = payload || {};

    if (!employeeId || !employeeNumber || !name) {
      logger.warn("Token payload missing required fields");
      return res.status(401).json({ error: "Invalid token payload" });
    }

    // Attach to req.user for downstream use (do NOT mutate req.body unless necessary)
    req.user = { employeeId, employeeNumber, name, raw: payload };

    return next();
  } catch (err) {
    logger.error("Auth middleware error", err.message || err);
    return res.status(500).json({ error: "Authentication failed" });
  }
}
