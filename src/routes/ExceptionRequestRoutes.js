import express from "express";
import auth from "../middleware/auth.js";

import {
  createExceptionRequest,
  bulkUpdateExceptionRequest,
  getSelectionDatesForEmployee,
  getExceptionSummary,
  getExceptionRequestsWithPagination,
} from "../controller/ExceptionController.js";

import {
  validateBulkUpdateExceptionRequest,
  validateCreateExceptionRequest,
  validateGetSelectionDates,
  validateSummaryRequest,
  validateGetExceptionRequests,
} from "../middleware/validate/exception.validate.js";

import { checkValidation } from "../middleware/validate/validateResult.js";

const router = express.Router();

/**
 * Base route: /api/exception-requests
 * All routes are protected by auth middleware
 */
router.use(auth);

// 📌 Create new exception request
router.post(
  "/",
  validateCreateExceptionRequest,
  checkValidation,
  createExceptionRequest
);

// 📌 Bulk update exception requests (approve/reject multiple)
router.put(
  "/",
  validateBulkUpdateExceptionRequest,
  checkValidation,
  bulkUpdateExceptionRequest
);

// 📌 Get paginated exception requests (with filters)
router.get(
  "/paginated",
  validateGetExceptionRequests,
  checkValidation,
  getExceptionRequestsWithPagination
);

// 📌 Get selected exception dates for an employee (month/year)
router.get(
  "/selected-dates",
  validateGetSelectionDates,
  checkValidation,
  getSelectionDatesForEmployee
);

// 📌 Get summary of exception requests (approved/pending/rejected counts)
router.get(
  "/summary",
  validateSummaryRequest,
  checkValidation,
  getExceptionSummary
);

export default router;

/**
 * @openapi
 * components:
 *   schemas:
 *     ExceptionRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         employeeId:
 *           type: number
 *           example: 12345
 *         employeeName:
 *           type: string
 *           example: "John Doe"
 *         exceptionDate:
 *           type: string
 *           format: date
 *           example: "2025-10-30"
 *         reason:
 *           type: string
 *           example: "Work from home"
 *         status:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *           example: "PENDING"
 *
 * /api/exception-requests:
 *   post:
 *     summary: Create new exception request
 *     tags: [Exceptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exceptionDate
 *               - reason
 *             properties:
 *               exceptionDate:
 *                 type: string
 *                 format: date
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Exception request created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ExceptionRequest'
 *
 *   put:
 *     summary: Bulk update exception requests
 *     tags: [Exceptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - updates
 *             properties:
 *               updates:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     status:
 *                       type: string
 *                       enum: [APPROVED, REJECTED]
 *     responses:
 *       200:
 *         description: Requests updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Updated successfully"
 *
 * /api/exception-requests/paginated:
 *   get:
 *     summary: Get filtered exception requests with pagination
 *     tags: [Exceptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of exception requests
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
 *                     total:
 *                       type: number
 *                       example: 100
 *                     page:
 *                       type: number
 *                       example: 1
 *                     limit:
 *                       type: number
 *                       example: 10
 *                     results:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ExceptionRequest'
 *
 * /api/exception-requests/selected-dates:
 *   get:
 *     summary: Get selected dates for employee by month
 *     tags: [Exceptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Selected dates retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: date
 *                     example: "2025-10-30"
 *
 * /api/exception-requests/summary:
 *   get:
 *     summary: Get exception requests summary
 *     tags: [Exceptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Exception summary retrieved
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
 *                     total:
 *                       type: number
 *                       example: 50
 *                     pending:
 *                       type: number
 *                       example: 10
 *                     approved:
 *                       type: number
 *                       example: 30
 *                     rejected:
 *                       type: number
 *                       example: 10
 */
