import { findSessionById } from "../services/sessionService.js";
import { findEmployeeByNumber } from "../services/employeeService.js";
import { generateToken as generateJwtToken } from "../utils/jwt.js";
import logger from "../utils/logger.js";

const redact = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  const copy = { ...obj };
  // Redact common sensitive fields
  ["password", "pwd", "token", "jwt", "authorization"].forEach((k) => {
    if (k in copy) copy[k] = "[REDACTED]";
  });
  return copy;
};

const generateTokenFromSession = async (req, res) => {
  try {
    logger.info("Auth request start", {
      headers: redact(req.headers),
      body: redact(req.body),
      path: req.path,
      method: req.method,
    });
    const sessionId = req.headers["sessionid"];
    console.log("Session ID:", sessionId);
    if (!sessionId) {
      return res.status(400).json({ error: "Missing sessionID in headers" });
    }

    const sessionData = await findSessionById(sessionId);
    const employeeNumber = sessionData;

    if (!employeeNumber) {
      return res
        .status(400)
        .json({ error: "EmployeeNumber not found in session" });
    }

    const employee = await findEmployeeByNumber(employeeNumber);
    const token = generateJwtToken({
      employeeId: employee.EmployeeId,
      employeeNumber: employee.EmployeeNumber,
      name: `${employee.FirstName} ${employee.LastName}`,
    });

    return res.status(200).json({
      message: "Authentication successful",
      token,
      employee: {
        employeeId: employee.EmployeeId,
        employeeNumber: employee.EmployeeNumber,
        name: `${employee.FirstName} ${employee.LastName}`,
        email: employee.Email,
      },
    });
  } catch (err) {
    logger.error("Auth error", err.message);
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
};

export default generateTokenFromSession;
