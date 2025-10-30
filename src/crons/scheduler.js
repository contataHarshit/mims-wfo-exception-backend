import cron from "node-cron";
import { runExceptionNotificationJob } from "./exceptionNotificationCron.js";
import logger from "../utils/logger.js";

// Every day at 9 AM
cron.schedule("0 9 * * *", async () => {
  logger.info(" Starting daily exception notification cron job...");
  await runExceptionNotificationJob();
});
