// src/controllers/exceptionController.js
import {
  createException,
  getFilteredExceptions,
  updateException,
} from "../services/exceptionService.js";
import { findEmployeeByNumber } from "../services/employeeService.js";
import logger from "../utils/logger.js";

export const createExceptionRequest = async (req, res) => {
  try {
    const data = req.body;
    const employeeNumber = req.user.employeeNumber;
    const // Validate required fields
      {
        projectId,
        exceptions, // array of fromDate, toDate, reason, remarks
      } = data;
    console.log("Creating exception for employee:", employeeNumber);
    const employee = await findEmployeeByNumber(employeeNumber);

    if (projectId === undefined || typeof projectId !== "number") {
      return res
        .status(400)
        .json({ message: "projectId is required and must be a number" });
    }
    console.log("Employee details:", employee);
    const saved = await createException({
      employeeId: req.user.employeeId,
      projectId,
      action: "CREATE",
      exceptions: exceptions.map((ex) => ({
        fromDate: new Date(ex.fromDate),
        toDate: new Date(ex.toDate),
        ...ex,
      })),
      managerId: employee.ManagerId,
    });
    res.status(200).json(saved);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Error creating exception request" });
  }
};
export const updateExceptionRequests = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Validate required fields
  if (
    !updateData.currentStatus ||
    typeof updateData.currentStatus !== "string" ||
    !updateData.currentStatus === "APPROVED" ||
    !updateData.currentStatus === "REJECTED" ||
    !updateData.currentStatus === "PARTIALLY_APPROVED"
  ) {
    return res.status(400).json({
      message:
        "currentStatus is required and must be a string and APPROVED,REJECTED, PARTIALLT_APPROVED",
    });
  }

  if (
    !updateData.managerRemarks ||
    typeof updateData.managerRemarks !== "string"
  ) {
    return res.status(400).json({
      message: "managerRemarks is required and must be a string",
    });
  }

  try {
    const result = await updateException(Number(id), updateData);
    res.json({ message: "Exception request updated", data: result });
  } catch (error) {
    logger.error("Update error:", error);
    res.status(500).json({
      message: error.message || "Error updating exception request",
    });
  }
};
export const getExceptionRequests = async (req, res) => {
  try {
    const filters = req.query;

    // Always use employeeId from the JWT token if available
    const employeeId = req.user?.employeeId;

    const results = await getFilteredExceptions({
      ...filters,
      employeeId: employeeId ? Number(employeeId) : undefined,
    });

    res.json(results);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Error fetching exception requests" });
  }
};
