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
 *     tags:
 *       - Employee
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current employee profile (enveloped)
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
 *                       $ref: '#/components/schemas/EmployeeProfile'
 *   post:
 *     summary: Get employee profile and projects (alternate/legacy)
 *     tags:
 *       - Employee
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employee profile with assigned projects (enveloped)
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
 *                       $ref: '#/components/schemas/EmployeeProfile'
 *
 * /api/employee/manager:
 *   get:
 *     summary: Get employees under current manager
 *     tags:
 *       - Employee
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of employees (enveloped)
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
 *                         $ref: '#/components/schemas/BasicEmployee'
 *
 * /api/employee/all:
 *   get:
 *     summary: Get all employees
 *     tags:
 *       - Employee
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All employees (enveloped)
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
 *                         $ref: '#/components/schemas/BasicEmployee'
 */

router.get("/", getEmployee);
router.get("/manager", getManagerEmployee);
router.get("/all", getAllEmployees);
export default router;
