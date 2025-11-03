import { findSessionById } from "../services/sessionService.js";
import { findEmployeeByNumber } from "../services/employeeService.js";
import { generateToken as generateJwtToken } from "../utils/jwt.js";
import logger from "../utils/logger.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { BadRequestError } from "../errors/BadRequestError.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";
import { redact } from "../utils/redactUtils.js";
import { getUserRoleByWindowsName } from "../services/userService.js";

const generateTokenFromSession = async (req, res) => {
  const sessionId = req.headers["sessionid"];

  logger.info("Authentication Request Initiated", {
    path: req.path,
    method: req.method,
    headers: redact(req.headers),
    body: redact(req.body),
    sessionId,
  });

  try {
    const employeeNumber = await findSessionById(sessionId);
    if (!employeeNumber) {
      throw new NotFoundError(
        `Session not found or expired sessionid:${sessionId}`
      );
    }

    logger.info("Session found", { sessionId, employeeNumber });

    const employee = await findEmployeeByNumber(employeeNumber);
    if (!employee) {
      throw new NotFoundError(`Employee not found for session ${sessionId}`);
    }

    logger.info("Employee found", {
      employeeId: employee.EmployeeId,
      employeeNumber: employee.EmployeeNumber,
      name: `${employee.FirstName} ${employee.LastName}`,
    });
    const { role } = await getUserRoleByWindowsName(employee?.WindowsName);
    const tokenPayload = {
      employeeId: employee.EmployeeId,
      employeeNumber: employee.EmployeeNumber,
      name: `${employee.FirstName} ${employee.LastName}`,
      role,
    };

    const token = generateJwtToken(tokenPayload);

    logger.info("JWT Token generated", {
      employeeId: employee.EmployeeId,
      employeeNumber: employee.EmployeeNumber,
    });

    return sendSuccess(res, {
      message: "Authentication successful",
      token,
      employee: {
        employeeId: employee.EmployeeId,
        employeeNumber: employee.EmployeeNumber,
        name: `${employee.FirstName} ${employee.LastName}`,
        email: employee.Email,
        role,
      },
    });
  } catch (err) {
    logger.error("Authentication Error", {
      name: err.name,
      message: err.message,
      stack: err.stack,
      sessionId,
    });

    return sendError(res, err);
  }
};

export default generateTokenFromSession;
