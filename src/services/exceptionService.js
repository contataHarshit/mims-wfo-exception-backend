import { AppDataSource } from "../config/data-source.js";
import ExceptionRequest from "../entity/ExceptionRequest.js";
import ExceptionDateRange from "../entity/ExceptionDateRange.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import e from "express";
import { PermissionDeniedError } from "../errors/AuthError.js";

const dateRangeRepo = AppDataSource.getRepository(ExceptionDateRange);

const exceptionRepo = AppDataSource.getRepository(ExceptionRequest);

export const createException = async (data) => {
  const { employeeId, managerId, projectId, action, exceptions } = data;

  const exception = exceptionRepo.create({
    employee: { EmployeeId: employeeId },
    manager: { EmployeeId: managerId },
    project: { id: projectId },
    action,
    exceptions,
  });

  return await exceptionRepo.save(exception);
};

export const updateException = async (
  id,
  { updateDateRangeId, ...updateData },
  employeeId
) => {
  const existing = await exceptionRepo.findOne({
    where: { id },
    relations: ["exceptions", "employee", "manager", "project"],
  });

  if (!existing) {
    throw new NotFoundError(`Exception request with ID "${id}" not found`);
  }
  if (existing?.employee?.EmployeeId === employeeId) {
    throw new PermissionDeniedError(
      `You can't update your own record employeeId:${employeeId} recordEmployeeId: ${existing?.employee?.EmployeeId}`
    );
  }
  // Find the specific date range to update
  const targetRange = existing.exceptions.find(
    (range) => range.id === parseInt(updateDateRangeId, 10)
  );

  if (!targetRange) {
    throw new NotFoundError(
      `Exception date range with ID "${updateDateRangeId}" not found for request ID "${id}"`
    );
  }

  // Update fields
  if (updateData.currentStatus) {
    targetRange.currentStatus = updateData.currentStatus;
  }

  if (updateData.managerRemarks) {
    targetRange.managerRemarks = updateData.managerRemarks;
  }

  if (updateData.exceptionApprovedDays !== undefined) {
    targetRange.exceptionApprovedDays = parseInt(
      updateData.exceptionApprovedDays,
      10
    );
  }

  // Save and return updated exception request (with updated exception date range)
  return await exceptionRepo.save(existing);
};

export const getFilteredExceptions = async (filters, user) => {
  const {
    employeeName,
    employeeNumber,
    managerName,
    projectName,
    exceptionRequestedDays,
    exceptionApprovedDays,
    dateFrom,
    dateTo,
    currentStatus,
    exceptionDateFrom,
    exceptionDateTo,
    page = 1,
    limit = 10,
  } = filters;

  const { role, employeeId } = user; // role = "EMPLOYEE" | "MANAGER" | "HR" | "ADMIN"

  const query = exceptionRepo
    .createQueryBuilder("request")
    .leftJoin("request.employee", "employee")
    .leftJoin("request.project", "project")
    .leftJoin("request.manager", "manager")
    .leftJoinAndSelect("request.exceptions", "exceptionDetails")
    .addSelect([
      "employee.EmployeeNumber",
      "employee.FirstName",
      "employee.LastName",
      "project.ProjectName",
      "manager.FirstName",
      "manager.LastName",
    ]);

  // 🔒 Role-based data restriction
  if (role === "EMPLOYEE") {
    query.andWhere("employee.EmployeeId = :employeeId", { employeeId });
  } else if (role === "MANAGER") {
    query.andWhere("manager.EmployeeId = :employeeId", { employeeId });
  }

  // 🔍 Filters
  if (employeeName) {
    query.andWhere(
      "(employee.FirstName LIKE :employeeName OR employee.LastName LIKE :employeeName)",
      { employeeName: `%${employeeName}%` }
    );
  }

  if (employeeNumber) {
    query.andWhere("employee.EmployeeNumber LIKE :employeeNumber", {
      employeeNumber: `%${employeeNumber}%`,
    });
  }

  if (managerName) {
    query.andWhere(
      "(manager.FirstName LIKE :managerName OR manager.LastName LIKE :managerName)",
      { managerName: `%${managerName}%` }
    );
  }

  if (projectName) {
    query.andWhere("project.ProjectName LIKE :projectName", {
      projectName: `%${projectName}%`,
    });
  }

  if (dateFrom && dateTo) {
    query.andWhere("request.submissionDate BETWEEN :dateFrom AND :dateTo", {
      dateFrom,
      dateTo,
    });
  }

  if (exceptionDateFrom && exceptionDateTo) {
    query.andWhere(
      "exceptionDetails.fromDate BETWEEN :exceptionDateFrom AND :exceptionDateTo",
      { exceptionDateFrom, exceptionDateTo }
    );
  }

  if (currentStatus) {
    query.andWhere("exceptionDetails.currentStatus = :currentStatus", {
      currentStatus,
    });
  }

  if (exceptionRequestedDays) {
    query.andWhere(
      "exceptionDetails.exceptionRequestedDays = :exceptionRequestedDays",
      {
        exceptionRequestedDays,
      }
    );
  }

  if (exceptionApprovedDays) {
    query.andWhere(
      "exceptionDetails.exceptionApprovedDays = :exceptionApprovedDays",
      {
        exceptionApprovedDays,
      }
    );
  }

  // 📅 Sort by latest submission date first
  query.orderBy("request.submissionDate", "DESC");

  // 📄 Pagination
  query.skip((page - 1) * limit).take(limit);

  const [data, total] = await query.getManyAndCount();

  // 🧾 Format response
  return {
    data: data.map((exception) => ({
      ...exception,
      employeeName: `${exception?.employee?.FirstName || ""} ${
        exception?.employee?.LastName || ""
      }`.trim(),
      employeeNumber: exception?.employee?.EmployeeNumber,
      managerName: `${exception?.manager?.FirstName || ""} ${
        exception?.manager?.LastName || ""
      }`.trim(),
      projectName: exception?.project?.ProjectName,
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
