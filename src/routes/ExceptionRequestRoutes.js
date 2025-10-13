// src/routes/exceptionRoutes.js
import express from "express";
import {
  createExceptionRequest,
  getExceptionRequests,
  updateExceptionRequests,
} from "../controller/ExceptionController.js";

const router = express.Router();
/**
 * @openapi
 * /api/exception-requests:
 *   post:
 *     summary: Create a new exception request
 *     tags:
 *       - ExceptionRequests
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/", createExceptionRequest);

/**
 * @openapi
 * /api/exception-requests:
 *   get:
 *     summary: Get filtered exception requests
 *     tags:
 *       - ExceptionRequests
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: integer
 *         required: false
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", getExceptionRequests);

/**
 * @openapi
 * /api/exception-requests/{id}:
 *   put:
 *     summary: Update an exception request
 *     tags:
 *       - ExceptionRequests
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated
 */
router.put("/:id", updateExceptionRequests);
export default router;
