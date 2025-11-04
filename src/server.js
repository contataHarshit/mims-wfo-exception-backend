// src/server.js
import "reflect-metadata";
import dotenv from "dotenv";
import app from "./app.js";
import { AppDataSource } from "./config/data-source.js";
import logger from "./utils/logger.js"; // Use Winston instead of console.log

dotenv.config();

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    logger.info(" Database connected");
    app.listen(PORT, () => {
      logger.info(` Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("Database connection failed:", err);
  });
