import { AppDataSource } from "../config/data-source.js";
import ExceptionRequest from "../entity/ExceptionRequest.js";

const exceptionRepo = AppDataSource.getRepository(ExceptionRequest);

/**
 * Build dynamic filters for TypeORM queries based on role and parameters.
 */
const buildFilters = ({
  role,
  employeeId,
  fromDate,
  toDate,
  employeeName,
  managerName,
  status,
  reason,
}) => {
  const filters = {};

  // Date range filter
  if (fromDate && toDate) {
    filters.selectedDate = Between(new Date(fromDate), new Date(toDate));
  }

  // Status filter
  if (status) filters.currentStatus = status;

  // Role-based filters
  if (role === "EMPLOYEE") {
    filters.employee = { EmployeeId: employeeId };
  } else if (role === "MANAGER") {
    filters.manager = { EmployeeId: employeeId };
    if (employeeName)
      filters.employee = { FirstName: ILike(`%${employeeName}%`) };
    if (reason) filters.primaryReason = ILike(`%${reason}%`);
  } else if (role === "HR" || role === "ADMIN") {
    if (employeeName)
      filters.employee = { FirstName: ILike(`%${employeeName}%`) };
    if (managerName) filters.manager = { FirstName: ILike(`%${managerName}%`) };
    if (reason) filters.primaryReason = ILike(`%${reason}%`);
  }

  return filters;
};

/**
 * 🔹 Get Exception Requests with Pagination & Filters
 */
export const getExceptionRequestsWithPaginationService = async ({
  user,
  page = 1,
  limit = 10,
  fromDate,
  toDate,
  employeeName,
  managerName,
  status,
  reason,
  exportAll,
}) => {
  const filters = buildFilters({
    role: user.role,
    employeeId: user.employeeId,
    fromDate,
    toDate,
    employeeName,
    managerName,
    status,
    reason,
  });

  const queryBuilder = exceptionRepo
    .createQueryBuilder("exception")
    .leftJoinAndSelect("exception.employee", "employee")
    .leftJoinAndSelect("exception.manager", "manager")
    .leftJoinAndSelect("exception.updatedBy", "updatedBy")
    .where(filters)
    .orderBy("exception.selectedDate", "DESC");

  let data, total;

  if (exportAll === "true") {
    data = await queryBuilder.getMany();
    total = data.length;
  } else {
    data = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
    total = await queryBuilder.getCount();
  }

  return { data, total };
};

/**
 * 🔹 Get Exception Summary (HR / ADMIN)
 */
export const getExceptionSummaryService = async ({
  fromDate,
  toDate,
  employeeName,
  managerName,
  status,
  reason,
}) => {
  const filters = {};

  if (fromDate && toDate) {
    filters.selectedDate = Between(new Date(fromDate), new Date(toDate));
  }
  if (status) filters.currentStatus = status;
  if (employeeName)
    filters.employee = { FirstName: ILike(`%${employeeName}%`) };
  if (managerName) filters.manager = { FirstName: ILike(`%${managerName}%`) };
  if (reason) filters.primaryReason = ILike(`%${reason}%`);

  const queryBuilder = exceptionRepo
    .createQueryBuilder("exception")
    .leftJoinAndSelect("exception.employee", "employee")
    .leftJoinAndSelect("exception.manager", "manager")
    .where(filters);

  const all = await queryBuilder.getMany();

  return {
    APPROVED: all.filter((x) => x.currentStatus === "APPROVED").length,
    REJECTED: all.filter((x) => x.currentStatus === "REJECTED").length,
    PENDING: all.filter((x) => x.currentStatus === "PENDING").length,
    TOTAL: all.length,
  };
};
