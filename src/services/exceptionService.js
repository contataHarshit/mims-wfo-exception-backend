import { AppDataSource } from "../config/data-source.js";
import { In } from "typeorm";
import ExceptionRequest from "../entity/ExceptionRequest.js";
import logger from "../utils/logger.js";
import { getHolidayList } from "./HolidayListService.js";
const exceptionRepo = AppDataSource.getRepository(ExceptionRequest);

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

  const exception = exceptionRepo.create({
    employee: employee,
    manager: manager,
    selectedDate,
    primaryReason,
    remarks,
    updatedById,
    updatedByRole,
    currentStatus,
    submissionDate: new Date(),
  });

  return await exceptionRepo.save(exception);
};
export async function deleteExceptionById(exceptionId, employeeId) {
  const exception = await exceptionRepo.findOne({
    where: { id: exceptionId },
    relations: ["employee"],
  });

  if (!exception) {
    logger.warn(`Attempted to delete non-existent exception ID ${exceptionId}`);
    return null; // Let controller handle not-found logic
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
  await exceptionRepo.remove(exception);

  logger.info("Exception request deleted successfully", {
    exceptionId,
    deletedBy: employeeId,
  });

  return { deleted: exception };
}

export const bulkUpdateExceptionRequestService = async ({
  ids,
  status,
  employeeId,
  updatedRole,
  approvedBy,
  rejectedBy,
  remarks,
}) => {
  // 1️ Perform the update
  const result = await exceptionRepo
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
    .returning(["id"])
    .execute();

  // 2 Fetch the updated records
  const updatedIds = result.raw.map((r) => r.id);
  const updatedRecords = await exceptionRepo.findBy({ id: In(updatedIds) });
  return updatedRecords;
};

export const getSelectedDatesByMonth = async (employeeId, month, year) => {
  // Compute start and end dates
  const startDate = new Date(year, month - 2, 1); // month-2 because JS Date is 0-based
  const endDate = new Date(year, month, 0); // last day of next month
  endDate.setMonth(endDate.getMonth() + 2); // include one month after

  const records = await exceptionRepo
    .createQueryBuilder("exception")
    .select("exception.selectedDate")
    .where("exception.EmployeeId = :employeeId", { employeeId })
    .andWhere("exception.selectedDate BETWEEN :startDate AND :endDate", {
      startDate,
      endDate,
    })
    .orderBy("exception.selectedDate", "ASC")
    .getRawMany();
  const allHolidaysList = await getHolidayList();
  const exceptionDates = records.map((r) => r.exception_selectedDate);
  const combinedDates = Array.from(
    new Set([...allHolidaysList, ...exceptionDates])
  );
  return combinedDates;
};
