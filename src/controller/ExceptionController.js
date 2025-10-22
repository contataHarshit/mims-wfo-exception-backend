import {
  createException,
  getFilteredExceptions,
  updateException,
} from "../services/exceptionService.js";
import { findEmployeeByNumber } from "../services/employeeService.js";
import logger from "../utils/logger.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { BadRequestError } from "../errors/BadRequestError.js";

export const createExceptionRequest = async (req, res) => {
  const employeeNumber = req.user?.employeeNumber;
  const employeeId = req.user?.employeeId;
  const userInfo = req.user;

  try {
    const { projectId, exceptions } = req.body;

    logger.info("Create Exception Request initiated", {
      requestedBy: userInfo,
      body: req.body,
    });

    if (!projectId || typeof projectId !== "number") {
      throw new BadRequestError("projectId is required and must be a number");
    }

    if (!Array.isArray(exceptions) || exceptions.length === 0) {
      throw new BadRequestError("exceptions must be a non-empty array");
    }

    const employee = await findEmployeeByNumber(employeeNumber);
    if (!employee) {
      throw new NotFoundError(
        `Employee with number "${employeeNumber}" not found`
      );
    }

    const saved = await createException({
      employeeId,
      projectId,
      action: "CREATE",
      managerId: employee.ManagerId,
      exceptions: exceptions.map((ex) => ({
        ...ex,
        fromDate: new Date(ex.fromDate),
        toDate: new Date(ex.toDate),
      })),
    });

    logger.info("Exception created successfully", {
      employeeId,
      projectId,
      managerId: employee.ManagerId,
      exceptionId: saved.id,
    });

    return sendSuccess(res, {
      saved,
      message: "Exception created successfully",
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

export const updateExceptionRequests = async (req, res) => {
  const id = req.params.id || req.query.id;
  const updateData = req.body;
  const userInfo = req.user;

  try {
    logger.info("Update Exception Request initiated", {
      requestedBy: userInfo,
      exceptionId: id,
      updateData,
    });
    if (!updateData?.updateDateRangeId) {
      throw new BadRequestError(`updateDateRangeId is required`);
    }
    const validStatuses = ["APPROVED", "REJECTED", "PARTIALLY_APPROVED"];
    if (
      updateData.currentStatus &&
      !validStatuses.includes(updateData.currentStatus)
    ) {
      throw new BadRequestError(
        `currentStatus must be one of ${validStatuses.join(", ")}`
      );
    }

    if (
      updateData.managerRemarks &&
      typeof updateData.managerRemarks !== "string"
    ) {
      throw new BadRequestError("managerRemarks must be a string");
    }

    const result = await updateException(parseInt(id, 10), updateData);

    logger.info("Exception updated successfully", {
      updatedBy: userInfo,
      exceptionId: id,
      newStatus: updateData.currentStatus,
    });

    return sendSuccess(res, { result, message: "Exception request updated" });
  } catch (error) {
    logger.error("Error in updateExceptionRequests", {
      error: error.message,
      stack: error.stack,
      exceptionId: id,
      requestedBy: userInfo,
    });
    return sendError(res, error);
  }
};

export const getExceptionRequests = async (req, res) => {
  const filters = req.query;
  const userInfo = req.user;
  userInfo.role = "EMPLOYEE";
  try {
    logger.info("Get Exception Requests initiated", {
      requestedBy: userInfo,
      filters,
    });

    const results = await getFilteredExceptions(filters, userInfo);

    logger.info("Exception requests fetched", {
      requestedBy: userInfo,
      total: results.length,
    });

    return sendSuccess(res, results);
  } catch (error) {
    logger.error("Error in getExceptionRequests", {
      error: error.message,
      stack: error.stack,
      requestedBy: userInfo,
    });
    return sendError(res, error);
  }
};
