// src/routes/exceptionRoutes.js
import express from "express";
import generateTokenFromSession from "../controller/AuthController.js";
import { validateSessionRequest } from "../middleware/validate/session.validate.js";

const router = express.Router();

/**
 * @openapi
 * /api/auth:
 *   post:
 *     summary: Generate JWT token from a session
 *     description: Uses the session id header to generate a JWT for the employee
 *     parameters:
 *       - in: header
 *         name: sessionid
 *         schema:
 *           type: string
 *         required: true
 *         description: Session ID header
 *     responses:
 *       200:
 *         description: Token generated successfully (enveloped)
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
 *                     token:
 *                       type: string
 *                     employee:
 *                       type: object
 *                       properties:
 *                         employeeId:
 *                           type: integer
 *                         employeeNumber:
 *                           type: string
 *                         name:
 *                           type: string
 *       400:
 *         description: Bad request (missing session id)
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
router.post("/", validateSessionRequest, generateTokenFromSession);
export default router;
