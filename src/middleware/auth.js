import { verifyToken } from "../utils/jwt.js";
import logger from "../utils/logger.js";
import { sendError } from "../utils/responseHandler.js";
import { AuthError } from "../errors/AuthError.js";
import { findEmployeeByNumber } from "../services/employeeService.js";

export default async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.get("Authorization") || req.get("authorization");
    let token = null;
    if (!authHeader) {
      const err = new AuthError("Token payload missing required fields");
      logger.warn(err.message);
      return sendError(res, err, err.statusCode);
    }
    // Extract Bearer token (we can safely assume this will exist)
    const parts = authHeader.split(" ");
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      token = parts[1];
    } else {
      token = req.get("token") || req.get("x-access-token");
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

    const { employeeNumber, role } = payload || {};

    if (!employeeNumber) {
      const err = new AuthError("Token payload missing required fields");
      logger.warn(err.message, { payload });
      return sendError(res, err, err.statusCode);
    }

    const employee = await findEmployeeByNumber(employeeNumber);
    if (!employee) {
      const err = new AuthError("Employee not found or inactive");
      logger.warn(err.message, { employeeNumber });
      return sendError(res, err, err.statusCode);
    }

    req.user = {
      employeeId: employee.EmployeeId,
      employeeNumber: employee.EmployeeNumber,
      name: `${employee.FirstName} ${employee.LastName}`,
      email: employee.Email,
      role: employee.Role || role || "EMPLOYEE",
    };

    logger.info("User authenticated", {
      employeeNumber: employee.EmployeeNumber,
      name: `${employee.FirstName} ${employee.LastName}`,
      ip: req.ip,
      path: req.originalUrl,
    });

    next();
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
