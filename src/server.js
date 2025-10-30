// src/server.js
import "reflect-metadata";
import dotenv from "dotenv";
import app from "./app.js";
import { AppDataSource } from "./config/data-source.js";
import logger from "./utils/logger.js"; // Use Winston instead of console.log
import { sendMail } from "./utils/mailer.js";
// async function run() {
//   console.log("hiiiiiiii");
//   const success = await sendMail(
//     "dhamendrak@contata.in",
//     "Test Email from Node.js",
//     "APPROVED",
//     { name: "Dharmendra Kumar" }
//   );
//   console.log("Email send status:", success);
//   if (success) {
//     console.log("Email sent successfully");
//   } else {
//     console.log("Failed to send email");
//   }
// }

// run();
dotenv.config();

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    logger.info(" Database connected");
    import("./crons/scheduler.js").then(() => {
      logger.info(" Cron jobs initialized.");
    });
    app.listen(PORT, () => {
      logger.info(` Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("Database connection failed:", err);
  });
