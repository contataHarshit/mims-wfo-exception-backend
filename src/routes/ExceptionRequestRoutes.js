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
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExceptionCreateRequest'
 *     responses:
 *       201:
 *         description: Created (enveloped)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     exception:
 *                       $ref: '#/components/schemas/ExceptionRequest'
 *       400:
 *         description: Validation error (enveloped)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
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
 *         description: List of filtered exception requests (enveloped)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     exceptions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ExceptionRequest'
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               currentStatus:
 *                 type: string
 *                 enum: [PENDING, APPROVED, REJECTED, PARTIALLY_APPROVED]
 *               managerRemarks:
 *                 type: string
 *             required:
 *               - id
 *               - currentStatus
 *               - managerRemarks
 *     responses:
 *       200:
 *         description: Updated (enveloped)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     exception:
 *                       $ref: '#/components/schemas/ExceptionRequest'
 *       400:
 *         description: Validation error (enveloped)
 *     security:
 *       - bearerAuth: []
 */
router.put("/", updateExceptionRequests);

export default router;
