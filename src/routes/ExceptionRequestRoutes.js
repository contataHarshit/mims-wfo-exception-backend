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
 *             required:
 *               - exceptionDateRange
 *               - primaryReason
 *               - submissionDate
 *               - exceptionRequestedDays
 *               - action
 *               - employee
 *               - manager
 *               - project
 *             properties:
 *               exceptionDateRange:
 *                 type: string
 *                 example: "2025-10-14 to 2025-10-20"
 *               primaryReason:
 *                 type: string
 *                 example: "Family emergency"
 *               submissionDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-10-13"
 *               exceptionRequestedDays:
 *                 type: integer
 *                 example: 5
 *               action:
 *                 type: string
 *                 example: "CREATE"
 *               employee:
 *                 type: integer
 *                 example: 123
 *               manager:
 *                 type: integer
 *                 example: 456
 *               project:
 *                 type: integer
 *                 example: 789
 *     responses:
 *       201:
 *         description: Created
 *     security:
 *       - bearerAuth: []
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
 *       - in: query
 *         name: employeeName
 *         schema:
 *           type: string
 *         required: false
 *       - in: query
 *         name: managerName
 *         schema:
 *           type: string
 *         required: false
 *       - in: query
 *         name: projectName
 *         schema:
 *           type: string
 *         required: false
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *       - in: query
 *         name: currentStatus
 *         schema:
 *           type: string
 *         required: false
 *       - in: query
 *         name: exceptionRequestedDays
 *         schema:
 *           type: integer
 *         required: false
 *       - in: query
 *         name: exceptionApprovedDays
 *         schema:
 *           type: integer
 *         required: false
 *     responses:
 *       200:
 *         description: List of filtered exception requests
 *     security:
 *       - bearerAuth: []
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
 *     security:
 *       - bearerAuth: []
 */
router.put("/:id", updateExceptionRequests);

export default router;
