import { AppDataSource } from "../config/data-source.js";
import ExceptionRequest from "../entity/ExceptionRequest.js";
import logger from "../utils/logger.js";

const exceptionRepo = AppDataSource.getRepository(ExceptionRequest);

/**
 * 🟠 Get exceptions that start today and are still pending approval
 */
export const findPendingExceptionsStartingToday = async (today) => {
  logger.info(`Fetching PENDING exceptions ending today (${today})`);

  const results = await exceptionRepo
    .createQueryBuilder("request")
    .leftJoinAndSelect("request.employee", "employee")
    .leftJoinAndSelect("request.exceptions", "exception")
    .where("exception.toDate = :today", { today })
    .andWhere("exception.currentStatus = :status", { status: "PENDING" })
    .select([
      "request.id",
      "exception.fromDate",
      "exception.toDate",
      "exception.currentStatus",
      "employee.FirstName",
      "employee.LastName",
      "employee.Email",
    ])
    .getMany();
  return results.map((req) => ({
    exceptionRequestId: req.id,
    fromDate: req.exceptions[0]?.fromDate,
    toDate: req.exceptions[0]?.toDate,
    status: req.exceptions[0]?.currentStatus,
    employeeName: `${req.employee?.FirstName || ""} ${
      req.employee?.LastName || ""
    }`.trim(),
    employeeEmail: req.employee?.Email || null,
  }));
};

/**
 * 🟢 Get approved/partially approved exceptions that end today
 */
export const findApprovedExceptionsEndingToday = async (today) => {
  logger.info(
    `Fetching APPROVED or PARTIALLY_APPROVED exceptions ending today (${today})`
  );

  const results = await exceptionRepo
    .createQueryBuilder("request")
    .leftJoinAndSelect("request.employee", "employee")
    .leftJoinAndSelect("request.exceptions", "exception")
    .where("exception.toDate = :today", { today })
    .andWhere("exception.currentStatus IN (:...statuses)", {
      statuses: ["APPROVED", "PARTIALLY_APPROVED"],
    })
    .select([
      "request.id",
      "exception.fromDate",
      "exception.toDate",
      "exception.currentStatus",
      "employee.FirstName",
      "employee.LastName",
      "employee.Email",
    ])
    .getMany();
  return results.map((req) => ({
    exceptionRequestId: req.id,
    fromDate: req.exceptions[0]?.fromDate,
    toDate: req.exceptions[0]?.toDate,
    status: req.exceptions[0]?.currentStatus,
    employeeName: `${req.employee?.FirstName || ""} ${
      req.employee?.LastName || ""
    }`.trim(),
    employeeEmail: req.employee?.Email || null,
  }));
};
