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
 * @swagger
 * /api/exception-requests:
 *   post:
 *     summary: Create exception requests
 *     tags:
 *       - Exceptions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               exceptions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     selectedDate:
 *                       type: string
 *                       format: date
 *                     primaryReason:
 *                       type: string
 *                     remarks:
 *                       type: string
 *     responses:
 *       200:
 *         description: Exception requests created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     exceptions:
 *                       type: array
 *                       items:
 *                         type: object
 */
router.post(
  "/",
  validateCreateExceptionRequest,
  checkValidation,
  createExceptionRequest
);

/**
 * @swagger
 * /api/exception-requests:
 *   put:
 *     summary: Bulk update exception requests
 *     tags:
 *       - Exceptions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Exceptions updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     exceptions:
 *                       type: array
 *                       items:
 *                         type: object
 */
router.put(
  "/",
  validateBulkUpdateExceptionRequest,
  checkValidation,
  bulkUpdateExceptionRequest
);

/**
 * @swagger
 * /api/exception-requests/paginated:
 *   get:
 *     summary: Get exception requests with pagination
 *     tags:
 *       - Exceptions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
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
 *       - in: query
 *         name: employeeNumber
 *         schema:
 *           type: string
 *       - in: query
 *         name: managerEmployeeNumber
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: reason
 *         schema:
 *           type: string
 *       - in: query
 *         name: exportAll
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: isSelf
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Exception requests fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     exceptions:
 *                       type: array
 *                       items:
 *                         type: object
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         currentPage:
 *                           type: integer
 *                         pageSize:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 */
router.get(
  "/paginated",
  validateGetExceptionRequests,
  checkValidation,
  getExceptionRequestsWithPagination
);

/**
 * @swagger
 * /api/exception-requests/selected-dates:
 *   get:
 *     summary: Get selected dates for employee
 *     tags:
 *       - Exceptions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Selected dates fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     dates:
 *                       type: array
 *                       items:
 *                         type: string
 */
router.get(
  "/selected-dates",
  validateGetSelectionDates,
  checkValidation,
  getSelectionDatesForEmployee
);

/**
 * @swagger
 * /api/exception-requests/summary:
 *   get:
 *     summary: Get exception summary (HR/Admin only)
 *     tags:
 *       - Exceptions
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
 *       - in: query
 *         name: employeeNumber
 *         schema:
 *           type: string
 *       - in: query
 *         name: managerEmployeeNumber
 *         schema:
 *           type: string
 *       - in: query
 *         name: reason
 *         schema:
 *           type: string
 *       - in: query
 *         name: filterType
 *         schema:
 *           type: string
 *           default: ALL
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Summary data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     exceptions:
 *                       type: object
 */

router.get(
  "/summary",
  validateSummaryRequest,
  checkValidation,
  getExceptionSummary
);

export default router;
