import {
  createException,
  bulkUpdateExceptionRequestService,
  getSelectedDatesByMonth,
  deleteExceptionById,
} from "../services/exceptionService.js";
import { getExceptionRequestsWithPaginationService } from "../services/getExceptionService.js";
import { getExceptionSummaryService } from "../services/getExceptionSummaryService.js";
import {
  findEmployeeById,
  findEmployeeByNumber,
} from "../services/employeeService.js";
import logger from "../utils/logger.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { BadRequestError } from "../errors/BadRequestError.js";
import { sendMail } from "../utils/mailer.js";
import { PermissionDeniedError } from "../errors/AuthError.js";
import { sanitizeExceptionRequests } from "../utils/sanitizedUtils.js";
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
    const manager = await findEmployeeById(employee.ManagerId);
    if (!manager) {
      throw new NotFoundError(
        `Manager with id "${employee.ManagerId}" not found`
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
        employee,
        manager,
        updatedById: employee, // updatedBy = current employee
        updatedByRole: "EMPLOYEE", // role fixed as EMPLOYEE,
        currentStatus: "PENDING",
      });
      createdExceptions.push(saved);
    }
    const allDates = createdExceptions.map((ex) => ex.selectedDate);
    const formattedDates = allDates.map((d) => `<li>${d}</li>`).join("");
    const emailSent = await sendMail(
      manager?.Email,
      "PENDING",
      {
        name: manager?.FirstName + " " + manager?.LastName,
        employeeName: req?.user?.name,
        // role: userInfo?.role,
        dates: formattedDates,
      },
      employee?.Email
    );
    if (emailSent) {
      logger.info(
        `Notification email sent to manager ${manager?.Email} for employee ${employee?.Email}`
      );
    }
    logger.info("Exception requests created successfully", {
      employeeId,
      managerId,
      totalCreated: createdExceptions.length,
    });

    //  Step 5: Send response
    return sendSuccess(res, {
      message: "Exception requests created successfully",
      exceptions: sanitizeExceptionRequests(createdExceptions),
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
export const deleteExceptionRequest = async (req, res) => {
  const userInfo = req.user;
  const employeeNumber = userInfo?.employeeNumber;
  const id = req.params.id; // already converted by validator (.toInt)

  try {
    logger.info("Delete Exception Request initiated", {
      exceptionId: id,
      requestedBy: userInfo,
    });

    const employee = await findEmployeeByNumber(employeeNumber);
    if (!employee) {
      throw new NotFoundError(
        `Employee with number "${employeeNumber}" not found`
      );
    }

    const result = await deleteExceptionById(id, employee.EmployeeId);

    if (!result) {
      throw new NotFoundError(`Exception request with ID ${id} not found`);
    }

    if (result.unauthorized) {
      throw new BadRequestError(
        "You do not have permission to perform this action"
      );
    }

    if (result.invalidStatus) {
      throw new BadRequestError(
        `Only PENDING exceptions can be deleted (current status: ${result.status})`
      );
    }
    const emailSent = await sendMail(
      result?.employee?.Email,
      "CANCELED",
      {
        name: result?.employee?.FirstName + " " + result?.employee?.LastName,
        // reviewerName: manager?.FirstName + " " + manager?.LastName,
        // role: userInfo?.role,
        dates: result.selectedDate,
      },
      result?.manager?.Email
    );
    if (emailSent) {
      logger.info(
        `Notification email sent to manager ${result?.manager?.Email} for employee ${employee?.Email}`
      );
    }
    logger.info("Exception request deleted successfully", {
      exceptionId: id,
      deletedBy: employee.EmployeeId,
    });

    return sendSuccess(res, {
      message: `Exception request with ID ${id} deleted successfully`,
      deletedRequest: {
        id: result.deleted.id,
        selectedDate: result.deleted.selectedDate,
        primaryReason: result.deleted.primaryReason,
      },
    });
  } catch (error) {
    logger.error("Error deleting exception request", {
      error: error.message,
      stack: error.stack,
      exceptionId: id,
      requestedBy: userInfo,
    });
    return sendError(res, error);
  }
};
export const bulkUpdateExceptionRequest = async (req, res) => {
  const employeeId = req.user?.employeeId;
  const updatedRole = req.user?.role;
  const department = req.user?.department;
  const userInfo = req.user;

  try {
    const { ids, status, remarks } = req.body;

    logger.info("Bulk Update Exception Request initiated", {
      requestedBy: userInfo,
      body: req.body,
    });
    if (
      updatedRole !== "MANAGER" &&
      department !== "HR" &&
      updatedRole !== "ADMIN"
    ) {
      throw new PermissionDeniedError(
        `You do not have permission to perform this action`
      );
    }
    const updatedPayload = {
      ids,
      status,
      updatedRole,
      remarks,
    };
    // Add conditional fields based on status
    if (status === "APPROVED") {
      updatedPayload.approvedBy = req?.user?.name;
    }

    if (status === "REJECTED") {
      updatedPayload.rejectedBy = req?.user?.name;
    }
    const updateResult = await bulkUpdateExceptionRequestService(
      updatedPayload
    );
    // Assuming `updateResult` is your data array
    const groupedByEmployee = {};

    // Step 1: Group by employee email
    updateResult?.forEach((ex) => {
      const empEmail = ex?.employee?.Email;
      if (!groupedByEmployee[empEmail]) {
        groupedByEmployee[empEmail] = {
          employee: ex?.employee,
          manager: ex?.manager,
          dates: [],
        };
      }
      groupedByEmployee[empEmail].dates.push(ex.selectedDate);
    });

    // Step 2: Send email to each employee and their manager
    for (const empEmail in groupedByEmployee) {
      const { employee, manager, dates } = groupedByEmployee[empEmail];
      let emailSentTo = employee?.Email;
      let ccTO = [manager?.Email];
      if (status === "APPROVED") {
        const hrgroupEmail = process.env.HR_EMAIL;
        if (req.user.email !== manager?.Email)
          ccTO = [...ccTO, req.user.email, hrgroupEmail];
      }
      // Format dates as list items
      const formattedDates = dates.map((d) => `<li>${d}</li>`).join("");

      // Send email
      const emailSent = await sendMail(
        emailSentTo, // Employee email
        status === "APPROVED" ? "APPROVED" : "REJECTED",
        {
          name: `${employee?.FirstName} ${employee?.LastName}`,
          reviewerName: req?.user?.name,
          dates: formattedDates,
        },
        req?.user?.email
      );

      if (emailSent) {
        logger.info(
          `Notification email sent to ${employee?.Email} and manager ${manager?.Email} status:${status} updatedby:${req.user.email}`
        );
      }
    }

    logger.info("Exceptions updated successfully", {
      updatedIds: ids,
      status,
    });

    return sendSuccess(res, {
      exceptions: sanitizeExceptionRequests(updateResult),
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
  let {
    page,
    limit,
    fromDate,
    toDate,
    employeeNumber,
    managerEmployeeNumber,
    status,
    reason,
    exportAll,
    isSelf,
    isAll = true,
  } = req.query;
  if (isSelf === "true") {
    employeeNumber = req.user.employeeNumber;
    req.user.role = "EMPLOYEE";
  }
  if (
    isAll === "true" &&
    (req.user.department === "HR" || req.user.role === "ADMIN")
  ) {
    req.user.role = "ADMIN";
  }
  try {
    const { data, total } = await getExceptionRequestsWithPaginationService({
      user: req.user,
      page,
      limit,
      fromDate,
      toDate,
      employeeNumber,
      managerEmployeeNumber,
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
      exceptions: sanitizeExceptionRequests(data),
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
  try {
    const { role, department } = req.user;

    if (department !== "HR" && role !== "ADMIN") {
      return sendError(res, {
        message: "Unauthorized access",
        statusCode: 403,
      });
    }

    const {
      fromDate,
      toDate,
      employeeNumber,
      managerEmployeeNumber,
      reason,
      filterType,
      page = 1,
      limit = 10,
    } = req.query;

    const summary = await getExceptionSummaryService({
      fromDate,
      toDate,
      employeeNumber,
      managerEmployeeNumber,
      reason,
      filterType,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    return sendSuccess(res, {
      message: "Summary fetched successfully",
      exceptions: summary,
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
