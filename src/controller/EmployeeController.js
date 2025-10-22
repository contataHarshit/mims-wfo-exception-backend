import {
  findEmployeeById,
  findAllEmployees,
  findEmployeeByManagerId,
} from "../services/employeeService.js";
import { getProjectsByEmployeeId } from "../services/projectAssignmentService.js";
import logger from "../utils/logger.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";
import { NotFoundError } from "../errors/NotFoundError.js";

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

    const projects = await getProjectsByEmployeeId(String(employee.EmployeeId));

    const result = {
      employeeId: employee.EmployeeId,
      employeeName: [employee.FirstName, employee.MiddleName, employee.LastName]
        .filter(Boolean)
        .join(" "),
      managerName: null,
      projects: projects.map((p) => ({
        id: p.ProjectId,
        name: p.ProjectName,
      })),
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

  try {
    if (!managerId) {
      logger.warn("Missing managerId in req.user", { user: userInfo });
      throw new NotFoundError("Manager ID not found in request");
    }

    const employees = await findEmployeeByManagerId(managerId);

    logger.info("Fetched employees under manager", {
      managerId,
      employeeCount: employees.length,
      requestedBy: userInfo,
    });

    return sendSuccess(res, { employees });
  } catch (error) {
    logger.error("Error in getManagerEmployee", {
      error: error.message,
      stack: error.stack,
      requestedBy: userInfo,
    });
    return sendError(res, error);
  }
};

// Get all employees
export const getAllEmployees = async (req, res) => {
  const userInfo = req.user || {};

  try {
    const employees = await findAllEmployees();

    logger.info("Fetched all employees", {
      employeeCount: employees.length,
      requestedBy: userInfo,
    });

    return sendSuccess(res, { employees });
  } catch (error) {
    logger.error("Error in getAllEmployees", {
      error: error.message,
      stack: error.stack,
      requestedBy: userInfo,
    });
    return sendError(res, error);
  }
};
