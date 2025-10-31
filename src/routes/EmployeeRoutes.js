// src/routes/employeeRoutes.js
import express from "express";
import {
  getEmployee,
  getManagerEmployee,
  getAllEmployees,
} from "../controller/EmployeeController.js";

const router = express.Router();

/**
 * @openapi
 * /api/employee:
 *   get:
 *     summary: Get current employee profile
 *     description: Returns the profile of the currently logged-in employee. Authentication via Bearer token is required.
 *     tags:
 *       - Employee
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current employee profile
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
 *                     employee:
 *                       type: object
 *                       properties:
 *                         employeeId:
 *                           type: integer
 *                           example: 2
 *                         employeeName:
 *                           type: string
 *                           example: "Aditya Kumar"
 *                         managerName:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *
 * /api/employee/manager:
 *   get:
 *     summary: Get employees under current manager
 *     description: Only accessible by managers. Returns a paginated list of employees under the logged-in manager. Authentication via Bearer token is required.
 *     tags:
 *       - Employee
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *         description: Number of employees per page
 *     responses:
 *       200:
 *         description: Paginated list of employees under the manager
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
 *                     employees:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           EmployeeNumber:
 *                             type: string
 *                             example: "DK1601"
 *                           FullName:
 *                             type: string
 *                             example: "Dharmendar Kumar"
 *                     total:
 *                       type: integer
 *                       example: 1
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *
 * /api/employee/all:
 *   get:
 *     summary: Get all employees
 *     description: Only accessible by HR or Admin users. Returns a paginated list of all employees. Authentication via Bearer token is required.
 *     tags:
 *       - Employee
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *         description: Number of employees per page
 *     responses:
 *       200:
 *         description: Paginated list of all employees
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
 *                     employees:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           EmployeeNumber:
 *                             type: string
 *                             example: "DK1601"
 *                           FullName:
 *                             type: string
 *                             example: "Dharmendar Kumar"
 *                     total:
 *                       type: integer
 *                       example: 1
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.get("/", getEmployee);
router.get("/manager", getManagerEmployee);
router.get("/all", getAllEmployees);
export default router;
