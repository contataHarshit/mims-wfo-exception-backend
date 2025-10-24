import { verifyToken } from "../utils/jwt.js";
import logger from "../utils/logger.js";
import { sendError } from "../utils/responseHandler.js";
import { AuthError } from "../errors/AuthError.js";

export default function authMiddleware(req, res, next) {
  try {
    const authHeader = req.get("Authorization") || req.get("authorization");
    let token = null;

    // Check Bearer token
    if (authHeader && typeof authHeader === "string") {
      const parts = authHeader.split(" ");
      if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
        token = parts[1];
      }
    }

    // Fallback headers
    if (!token) {
      token = req.get("token") || req.get("x-access-token");
    }

    if (!token) {
      const err = new AuthError("Missing authentication token");
      logger.warn(err.message, { ip: req.ip, path: req.originalUrl });
      return sendError(res, err, err.statusCode);
    }

    let payload;
    try {
      payload = verifyToken(token);
    } catch (err) {
      const authErr = new AuthError("Invalid or expired token");
      logger.warn(authErr.message, {
        error: err.message,
        ip: req.ip,
        path: req.originalUrl,
      });
      return sendError(res, authErr, authErr.statusCode);
    }

    const { employeeId, employeeNumber, name, role } = payload || {};

    if (!employeeId || !employeeNumber || !name) {
      const err = new AuthError("Token payload missing required fields");
      logger.warn(err.message, { payload });
      return sendError(res, err, err.statusCode);
    }

    req.user = {
      employeeId,
      employeeNumber,
      name,
      role,
    };

    logger.info("User authenticated", {
      user: { employeeId, employeeNumber, name },
      ip: req.ip,
      path: req.originalUrl,
    });

    return next();
  } catch (err) {
    logger.error("Auth middleware error", {
      message: err.message,
      stack: err.stack,
      path: req.originalUrl,
      ip: req.ip,
    });
    return sendError(res, err, 500);
  }
}
