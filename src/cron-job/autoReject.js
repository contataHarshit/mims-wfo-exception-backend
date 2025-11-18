import cron from "node-cron";
import { AppDataSource } from "../config/data-source.js";
import ExceptionRequest from "../entity/ExceptionRequest.js";
import logger from "../utils/logger.js"; // <-- Use your Winston logger

// (adjust path as needed)
const exceptionRepo = AppDataSource.getRepository(ExceptionRequest);
cron.schedule("0 8 1 * *", async () => {
  try {
    logger.info(" Auto-Reject Cron Started...");
    // 1️ Get today's date (run date)
    const today = new Date();

    // 2️ Get the 1st day of the previous month
    const firstDayPrevMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );

    logger.info(
      `Auto-Rejecting requests with selectedDate < ${
        firstDayPrevMonth.toISOString().split("T")[0]
      }`
    );

    //  Perform bulk REJECT update
    const result = await exceptionRepo
      .createQueryBuilder()
      .update(ExceptionRequest)
      .set({
        currentStatus: "REJECTED",
        rejectedBy: "SYSTEM",
        reviewRemarks: "Automatically rejected by system",
      })
      .where("currentStatus = :status", { status: "PENDING" })
      .andWhere("selectedDate < :selectedDateLimit", {
        selectedDateLimit: firstDayPrevMonth.toISOString().split("T")[0],
      })
      .execute();

    logger.info(` Auto-Rejected ${result.affected} request(s).`);
  } catch (error) {
    logger.error(" Auto-Reject Cron Failed", { error });
  }
});
