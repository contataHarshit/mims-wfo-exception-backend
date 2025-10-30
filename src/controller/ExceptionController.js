import {
  createException,
  bulkUpdateExceptionRequestService,
  getSelectedDatesByMonth,
} from "../services/exceptionService.js";
import {
  getExceptionRequestsWithPaginationService,
  getExceptionSummaryService,
} from "../services/getExceptionService.js";
import { findEmployeeByNumber } from "../services/employeeService.js";
import logger from "../utils/logger.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { BadRequestError } from "../errors/BadRequestError.js";
import { sendMail } from "../utils/mailer.js";
import { PermissionDeniedError } from "../errors/AuthError.js";
export const createExceptionRequest = async (req, res) => {
  const employeeNumber = req.user?.employeeNumber;
  const userInfo = req.user;

  try {
    const { exceptions } = req.body;

    logger.info("Create Exception Request initiated", {
      requestedBy: userInfo,
      body: req.body,
    });

    //  Step 1: Fetch employee by employeeNumber
    const employee = await findEmployeeByNumber(employeeNumber);
    if (!employee) {
      throw new NotFoundError(
        `Employee with number "${employeeNumber}" not found`
      );
    }

    const employeeId = employee.EmployeeId;
    const managerId = employee.ManagerId;

    //  Step 2: Validate `exceptions` array
    if (!exceptions || !Array.isArray(exceptions) || exceptions.length === 0) {
      throw new Error("At least one exception object is required");
    }

    const createdExceptions = [];

    //  Step 3: Loop through each exception object
    for (const ex of exceptions) {
      const { selectedDate, primaryReason, remarks } = ex;

      const saved = await createException({
        selectedDate,
        primaryReason,
        remarks,
        employeeId,
        managerId,
        updatedById: employeeId, // updatedBy = current employee
        updatedByRole: "EMPLOYEE", // role fixed as EMPLOYEE,
        currentStatus: "PENDING",
      });
      createdExceptions.push(saved);
    }

    logger.info("Exception requests created successfully", {
      employeeId,
      managerId,
      totalCreated: createdExceptions.length,
    });

    //  Step 5: Send response
    return sendSuccess(res, {
      message: "Exception requests created successfully",
      data: createdExceptions,
    });
  } catch (error) {
    logger.error("Error in createExceptionRequest", {
      error: error.message,
      stack: error.stack,
      requestedBy: userInfo,
    });
    return sendError(res, error);
  }
};
export const bulkUpdateExceptionRequest = async (req, res) => {
  const employeeId = req.user?.employeeId;
  const updatedRole = req.user?.role;
  const userInfo = req.user;

  try {
    const { ids, status } = req.body;

    logger.info("Bulk Update Exception Request initiated", {
      requestedBy: userInfo,
      body: req.body,
    });
    console.log("updatedRole", updatedRole !== "MANAGER", updatedRole !== "HR");
    if (updatedRole !== "MANAGER" && updatedRole !== "HR") {
      throw new PermissionDeniedError(
        `You do not have permission to perform this action`
      );
    }
    const updateResult = await bulkUpdateExceptionRequestService({
      ids,
      status,
      employeeId,
      updatedRole,
    });

    logger.info("Exceptions updated successfully", {
      updatedIds: ids,
      status,
    });

    return sendSuccess(res, {
      updateResult,
      message: "Exceptions updated successfully",
    });
  } catch (error) {
    logger.error("Error in bulkUpdateExceptionRequest", {
      error: error.message,
      stack: error.stack,
      requestedBy: userInfo,
    });
    return sendError(res, error);
  }
};
export const getSelectionDatesForEmployee = async (req, res) => {
  const userInfo = req.user;
  try {
    const { month, year } = req.body || req.query;
    const employeeId = userInfo.employeeId;

    logger.info("Get selection dates initiated", {
      requestedBy: userInfo,
      body: req.body,
    });

    const dates = await getSelectedDatesByMonth(employeeId, month, year);

    logger.info("Selected dates fetched successfully", {
      requestedBy: userInfo,
      dates,
    });

    return sendSuccess(res, {
      dates,
      message: "Selected dates fetched successfully",
    });
  } catch (err) {
    logger.error("Error in getSelectionDatesForEmployee", {
      error: err.message,
      stack: err.stack,
      requestedBy: req.user,
    });
    return sendError(res, err);
  }
};

export const getExceptionRequestsWithPagination = async (req, res) => {
  const {
    page,
    limit,
    fromDate,
    toDate,
    employeeName,
    managerName,
    status,
    reason,
    exportAll,
  } = req.query;

  try {
    const { data, total } = await getExceptionRequestsWithPaginationService({
      user: req.user,
      page,
      limit,
      fromDate,
      toDate,
      employeeName,
      managerName,
      status,
      reason,
      exportAll,
    });

    logger.info("Fetched exception requests", {
      requestedBy: req.user,
      count: data.length,
      total,
    });

    return sendSuccess(res, {
      message: "Exception requests fetched successfully",
      data,
      pagination: {
        total,
        currentPage: Number(page),
        pageSize: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error("Error in getExceptionRequestsWithPagination", {
      error: error.message,
      stack: error.stack,
      requestedBy: req.user,
    });
    return sendError(res, error);
  }
};

export const getExceptionSummary = async (req, res) => {
  const { role } = req.user;
  const { fromDate, toDate, employeeName, managerName, status, reason } =
    req.query;

  try {
    if (role !== "HR" && role !== "ADMIN") {
      return sendError(res, {
        message: "You are not authorized to access summary data",
        statusCode: 403,
      });
    }

    const summary = await getExceptionSummaryService({
      fromDate,
      toDate,
      employeeName,
      managerName,
      status,
      reason,
    });

    logger.info("Fetched exception summary", {
      requestedBy: req.user,
      summary,
    });

    return sendSuccess(res, {
      message: "Summary data fetched successfully",
      summary,
    });
  } catch (error) {
    logger.error("Error in getExceptionSummary", {
      error: error.message,
      stack: error.stack,
      requestedBy: req.user,
    });
    return sendError(res, error);
  }
};
