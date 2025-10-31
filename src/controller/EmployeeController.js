import {
  findEmployeeById,
  findAllEmployees,
  findEmployeeByManagerId,
} from "../services/employeeService.js";
import logger from "../utils/logger.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { PermissionDeniedError } from "../errors/AuthError.js";

// Get currently logged-in employee
export const getEmployee = async (req, res) => {
  const employeeId = req.user?.employeeId;
  const userInfo = req.user || {};

  try {
    if (!employeeId) {
      logger.warn("Missing employeeId in req.user", { user: userInfo });
      throw new NotFoundError("Employee ID not found in request");
    }

    const employee = await findEmployeeById(employeeId);
    if (!employee) {
      logger.warn("Employee not found by ID", {
        requestedEmployeeId: employeeId,
        user: userInfo,
      });
      throw new NotFoundError(`Employee with ID "${employeeId}" not found`);
    }

    const result = {
      employeeId: employee.EmployeeId,
      employeeName: [employee.FirstName, employee.MiddleName, employee.LastName]
        .filter(Boolean)
        .join(" "),
      managerName: null,
    };

    if (employee?.ManagerId) {
      const manager = await findEmployeeById(employee.ManagerId);
      if (manager) {
        result.managerName = {
          EmployeeId: manager.EmployeeId,
          name: `${manager.FirstName} ${manager.LastName}`,
        };
      } else {
        logger.warn("Manager not found", {
          managerId: employee.ManagerId,
          employeeId: employee.EmployeeId,
        });
      }
    }

    logger.info("Successfully fetched employee profile", {
      requestedBy: userInfo,
      employeeId: result.employeeId,
    });

    return sendSuccess(res, { employee: result });
  } catch (error) {
    logger.error("Error in getEmployee", {
      error: error.message,
      stack: error.stack,
      requestedBy: userInfo,
    });
    return sendError(res, error);
  }
};

// Get employees under current manager
export const getManagerEmployee = async (req, res) => {
  const managerId = req.user?.employeeId;
  const userInfo = req.user || {};
  const { page = 1, limit = 10 } = req.query; // default values

  try {
    if (userInfo.role !== "MANAGER") {
      logger.warn("Unauthorized access to manager employees", {
        user: userInfo,
      });
      throw new PermissionDeniedError("Unauthorized access");
    }
    if (!managerId) {
      logger.warn("Missing managerId in req.user", { user: userInfo });
      throw new NotFoundError("Manager ID not found in request");
    }

    const { employees, total } = await findEmployeeByManagerId(
      managerId,
      page,
      limit
    );

    logger.info("Fetched employees under manager", {
      managerId,
      employeeCount: employees.length,
      requestedBy: userInfo,
      page,
      limit,
    });

    return sendSuccess(res, { employees, total, page, limit });
  } catch (error) {
    logger.error("Error in getManagerEmployee", {
      error: error.message,
      stack: error.stack,
      requestedBy: userInfo,
    });
    return sendError(res, error);
  }
};

// Get all employees with pagination
export const getAllEmployees = async (req, res) => {
  const userInfo = req.user || {};
  const { page = 1, limit = 10 } = req.query; // default pagination values

  try {
    if (userInfo.role !== "HR" && userInfo.role !== "ADMIN") {
      logger.warn("Unauthorized access to all employees", { user: userInfo });
      throw new PermissionDeniedError("Unauthorized access");
    }

    const { employees, total } = await findAllEmployees(page, limit);

    logger.info("Fetched all employees", {
      employeeCount: employees.length,
      totalEmployees: total,
      requestedBy: userInfo,
      page,
      limit,
    });

    return sendSuccess(res, { employees, total, page, limit });
  } catch (error) {
    logger.error("Error in getAllEmployees", {
      error: error.message,
      stack: error.stack,
      requestedBy: userInfo,
    });
    return sendError(res, error);
  }
};
