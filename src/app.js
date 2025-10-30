// src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import morganStream from "./utils/morganLogger.js"; // Morgan → Winston stream
import requestLogger from "./middleware/logger.js"; // Optional custom logging
import exceptionRequestRoutes from "./routes/ExceptionRequestRoutes.js"; // Add your exceptions
import authRoutes from "./routes/AuthRoute.js";
import employeeRoutes from "./routes/EmployeeRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";
import authMiddleware from "./middleware/auth.js";
import { validateAuthHeader } from "./middleware/validate/auth.validate.js";

dotenv.config();

const app = express();

// Global Middleware
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    // You can refine this to whitelist domains in production
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "sessionid",
    "X-Requested-With",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
// Handle preflight requests using a middleware to avoid path-to-regexp issues
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    // Let the cors middleware set headers, then end the preflight with 204
    return cors(corsOptions)(req, res, () => res.sendStatus(204));
  }
  next();
});
app.use(express.json());

// HTTP Logging (Morgan → Winston)
app.use(morgan("combined", { stream: morganStream }));

// Custom Middleware Logger (Optional)
app.use(requestLogger);

// Routes
// app.use("/api/auth", AuthRoutes);

// app.use("/api/exception-requests", ExceptionRequestRoutes);
// app.use("/api/employee", EmployeeRoutes);

// Swagger documentation setup
app.use("/api-docs", swaggerUi.serve);
app.use("/api-docs", swaggerUi.setup(swaggerSpec));

// Apply auth middleware AFTER swagger routes
app.use("/api/auth", authRoutes);
app.use(validateAuthHeader);

app.use("/api", authMiddleware);

// Mount route handlers
app.use("/api/employee", employeeRoutes);
app.use("/api/exception-requests", exceptionRequestRoutes);

export default app;
