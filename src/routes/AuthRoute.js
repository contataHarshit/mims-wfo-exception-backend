// src/routes/exceptionRoutes.js
import express from "express";
import generateTokenFromSession from "../controller/AuthController.js";

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
 *         description: Token generated successfully
 */
router.post("/", generateTokenFromSession);
export default router;
