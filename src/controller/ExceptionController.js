// src/controllers/exceptionController.js
import {
  createException,
  getFilteredExceptions,
  updateException,
} from "../services/exceptionService.js";
import logger from "../utils/logger.js";

export const createExceptionRequest = async (req, res) => {
  try {
    const data = req.body;
    const saved = await createException({
      employeeId: req.user.employeeId,
      ...data,
    });
    res.status(201).json(saved);
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
