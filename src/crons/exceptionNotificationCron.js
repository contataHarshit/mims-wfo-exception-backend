import {
  findPendingExceptionsStartingToday,
  findApprovedExceptionsEndingToday,
} from "../services/exceptionNotificationService.js";
// import { sendEmail } from "../utils/sendEmail.js";
import logger from "../utils/logger.js";

export const runExceptionNotificationJob = async () => {
  const today = new Date().toISOString().split("T")[0];
  logger.info(`🚀 Running daily exception notification job for ${today}`);

  try {
    //  STEP 1: Pending exceptions starting today
    const pendingStart = await findPendingExceptionsStartingToday(today);

    if (pendingStart.length) {
      logger.info(
        `Found ${pendingStart.length} pending exceptions starting today.`
      );

      for (const req of pendingStart) {
        if (!req.employeeEmail) continue;
        await sendEmail(
          req.employeeEmail,
          "Reminder: Your Exception Request Starts Today (Pending Approval)",
          req.status,
          { name: req.employeeName, fromDate: req.fromDate }
        );

        logger.info(` Sent pending-start email to ${req.employeeEmail}`);
      }
    } else {
      logger.info("No pending exceptions starting today.");
    }

    //  STEP 2: Approved exceptions ending today
    const approvedEnding = await findApprovedExceptionsEndingToday(today);

    if (approvedEnding.length) {
      logger.info(
        `Found ${approvedEnding.length} approved exceptions ending today.`
      );

      for (const req of approvedEnding) {
        if (!req.employeeEmail) continue;
        await sendEmail(
          req.employeeEmail,
          "Notice: Your Approved Exception Ends Today",
          req.status,
          { name: req.employeeName, fromDate: req.fromDate }
        );

        logger.info(` Sent approved-ending email to ${req.employeeEmail}`);
      }
    } else {
      logger.info("No approved exceptions ending today.");
    }

    logger.info(" Daily exception notification job completed.");
  } catch (error) {
    logger.error(" Error running exception notification job", {
      error: error.message,
      stack: error.stack,
    });
  }
};
