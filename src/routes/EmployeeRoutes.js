// src/routes/exceptionRoutes.js
import express from "express";
import { getEmployee } from "../controller/EmployeeController.js";

const router = express.Router();

/**
 * @openapi
 * /api/emplyee:
 *   post:
 *     summary: Get employee profile and projects
 *     tags:
 *       - Employee
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employee profile with assigned projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 employeeId:
 *                   type: integer
 *                 employeeName:
 *                   type: string
 *                 managerName:
 *                   type: string
 *                   nullable: true
 *                 projects:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *       401:
 *         description: Unauthorized
 */

router.get("/", getEmployee);
export default router;
