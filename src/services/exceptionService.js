import { AppDataSource } from "../config/data-source.js";
import { In } from "typeorm";
import ExceptionRequest from "../entity/ExceptionRequest.js";
import logger from "../utils/logger.js";
import { getHolidayList } from "./HolidayListService.js";

const exceptionRepo = AppDataSource.getRepository(ExceptionRequest);

/**
 * Create new exception
 */
export const createException = async (data) => {
  const {
    employee,
    manager,
    selectedDate,
    primaryReason,
    remarks,
    updatedById,
    updatedByRole,
    currentStatus,
  } = data;

  const exception = {
    employee,
    manager,
    selectedDate,
    primaryReason,
    remarks,
    updatedById,
    updatedByRole,
    currentStatus,
    submissionDate: new Date(),
  };

  const result = await AppDataSource.getRepository(ExceptionRequest)
    .createQueryBuilder()
    .insert()
    .values(exception)
    .output("INSERTED.id")
    .execute();

  // 🔍 Fix: use actual primary key name
  const insertedId = result.identifiers?.[0]?.id;

  if (!insertedId) {
    throw new Error("Insert succeeded but no ID returned.");
  }

  const insertedRecord = await AppDataSource.getRepository(ExceptionRequest)
    .createQueryBuilder("ex")
    .where("ex.id = :id", { id: insertedId })
    .getOne();

  return insertedRecord;
};

/**
 * Delete exception by ID (only if owned by employee & pending)
 */
export async function deleteExceptionById(exceptionId, employeeId) {
  const exception = await AppDataSource.getRepository(ExceptionRequest)
    .createQueryBuilder("ex")
    .leftJoinAndSelect("ex.employee", "emp")
    .where("ex.id = :exceptionId", { exceptionId })
    .getOne();

  if (!exception) {
    logger.warn(`Attempted to delete non-existent exception ID ${exceptionId}`);
    return null;
  }

  const isOwner = exception.employee?.EmployeeId === employeeId;
  if (!isOwner) {
    logger.warn(
      `Unauthorized delete attempt by Employee ${employeeId} on Exception ${exceptionId}`
    );
    return { unauthorized: true };
  }

  if (exception.currentStatus.toUpperCase() !== "PENDING") {
    logger.warn(
      `Attempt to delete non-pending exception (status: ${exception.currentStatus}) by Employee ${employeeId}`
    );
    return { invalidStatus: true, status: exception.currentStatus };
  }

  await AppDataSource.getRepository(ExceptionRequest)
    .createQueryBuilder()
    .delete()
    .where("id = :id", { id: exceptionId })
    .execute();

  logger.info("Exception request deleted successfully", {
    exceptionId,
    deletedBy: employeeId,
  });

  return { deleted: exception };
}

/**
 * Bulk update exception requests
 */
export const bulkUpdateExceptionRequestService = async ({
  ids,
  status,
  employeeId,
  updatedRole,
  approvedBy,
  rejectedBy,
  remarks,
}) => {
  const qb = exceptionRepo
    .createQueryBuilder()
    .update(ExceptionRequest)
    .set({
      currentStatus: status,
      updatedBy: employeeId,
      updatedByRole: updatedRole,
      reviewRemarks: remarks,
      ...(status === "APPROVED" && { approvedBy }),
      ...(status === "REJECTED" && { rejectedBy }),
    })
    .whereInIds(ids)
    .andWhere("currentStatus != :status", { status })
    .returning(["id"]);

  const result = await qb.execute();
  const updatedIds = result.raw.map((r) => r.id);

  if (updatedIds.length === 0) return [];

  // 2. SELECT updated rows (MSSQL safe)
  const updatedRecords = await exceptionRepo
    .createQueryBuilder("ex")
    .where("ex.id IN (:...ids)", { ids: updatedIds })
    .getMany();

  return updatedRecords;
};

/**
 * Get all selected dates + holiday list
 */

export const getSelectedDatesByMonth = async (employeeId, month, year) => {
  const pad = (n) => String(n).padStart(2, "0");
  const startDate = `${year}-${pad(month)}-01`;
  const endDate = `${year}-${pad(month)}-${new Date(year, month, 0).getDate()}`;

  const records = await exceptionRepo
    .createQueryBuilder("exception")
    .select("exception.selectedDate", "selectedDate") // alias it
    .where("exception.EmployeeId = :employeeId", { employeeId })
    .andWhere(
      "CAST(exception.selectedDate AS DATE) BETWEEN :startDate AND :endDate",
      { startDate, endDate }
    )
    .orderBy("exception.selectedDate", "ASC")
    .getRawMany();

  // Convert to YYYY-MM-DD
  const exceptionDates = records.map((r) => {
    const d = new Date(r.selectedDate);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  });

  const allHolidaysList = await getHolidayList();

  // Combine and remove duplicates
  return Array.from(new Set([...allHolidaysList, ...exceptionDates]));
};
