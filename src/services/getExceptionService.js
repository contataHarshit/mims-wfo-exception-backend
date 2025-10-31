import { AppDataSource } from "../config/data-source.js";
import { Between, ILike } from "typeorm";
import ExceptionRequest from "../entity/ExceptionRequest.js";

const exceptionRepo = AppDataSource.getRepository(ExceptionRequest);

/**
 * Build dynamic filters for TypeORM queries based on role and parameters.
 */
export const buildFilters = ({
  role,
  employeeId,
  fromDate,
  toDate,
  employeeNumber,
  managerEmployeeNumber,
  status,
  reason,
}) => {
  const filters = {};

  // 🔹 Date range filter (selectedDate)
  if (fromDate && toDate) {
    filters.selectedDate = Between(new Date(fromDate), new Date(toDate));
  }

  // 🔹 Status filter
  if (status) {
    filters.currentStatus = status;
  }

  // 🔹 Reason filter (applies to all roles)
  if (reason) {
    filters.primaryReason = ILike(`%${reason}%`);
  }

  // 🔹 Role-based filters
  if (role === "EMPLOYEE") {
    // Employee: Only their own exceptions
    filters.employee = { EmployeeId: employeeId };

    // Optional filters for their own requests
    if (employeeNumber)
      filters.employee.EmployeeNumber = ILike(`%${employeeNumber}%`);
  } else if (role === "MANAGER") {
    /**
     * Manager: See all requests of employees who report to them
     * (employee.ManagerId = manager's EmployeeId)
     */
    filters.employee = { ManagerId: employeeId };

    // Optional: Filter by employee number (if manager searches within their team)
    if (employeeNumber) {
      filters.employee.EmployeeNumber = ILike(`%${employeeNumber}%`);
    }
  } else if (role === "HR" || role === "ADMIN") {
    // HR/Admin: Can filter by employee or manager employee numbers
    if (employeeNumber) {
      filters.employee = { EmployeeNumber: ILike(`%${employeeNumber}%`) };
    }

    if (managerEmployeeNumber) {
      filters.manager = { EmployeeNumber: ILike(`%${managerEmployeeNumber}%`) };
    }
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
  managerEmployeeNumber,
  employeeNumber,
  status,
  reason,
  exportAll,
}) => {
  const filters = buildFilters({
    role: user.role,
    employeeId: user.employeeId,
    fromDate,
    toDate,
    employeeNumber,
    managerEmployeeNumber,
    status,
    reason,
  });

  const queryBuilder = exceptionRepo
    .createQueryBuilder("exception")
    .leftJoinAndSelect("exception.employee", "employee")
    .leftJoinAndSelect("exception.manager", "manager")
    .leftJoinAndSelect("exception.updatedBy", "updatedBy")
    .where(filters)
    .orderBy("exception.submissionDate", "DESC");

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
  console.log("Filters applied:", filters);
  return { data, total };
};
