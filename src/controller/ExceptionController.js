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
    const saved = await createException(data);
    res.status(201).json(saved);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Error creating exception request" });
  }
};
export const updateExceptionRequests = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const result = await updateException(Number(id), updateData);
    res.json({ message: "Exception request updated", data: result });
  } catch (error) {
    logger.error("Update error:", error);
    res
      .status(500)
      .json({ message: error.message || "Error updating exception request" });
  }
};

export const getExceptionRequests = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const filters = req.query;
    const results = await getFilteredExceptions({
      ...filters,
      employeeId: filters.employeeId ? Number(filters.employeeId) : undefined,
    });
    res.json(results);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Error fetching exception requests" });
  }
};
