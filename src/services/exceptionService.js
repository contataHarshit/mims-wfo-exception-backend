// src/services/exceptionService.js
import { AppDataSource } from "../config/data-source.js";

const exceptionRepo = AppDataSource.getRepository("ExceptionRequest");

export const createException = async (data) => {
  const exception = exceptionRepo.create(data);
  return await exceptionRepo.save(exception);
};
export const updateException = async (id, updateData) => {
  const existing = await exceptionRepo.findOneBy({ id });

  if (!existing) {
    throw new Error("Exception request not found");
  }

  exceptionRepo.merge(existing, updateData);
  return await exceptionRepo.save(existing);
};

export const getFilteredExceptions = async (filters) => {
  const {
    employeeId,
    employeeName,
    managerName,
    projectName,
    dateFrom,
    dateTo,
    currentStatus,
    exceptionRequestedDays,
    exceptionApprovedDays,
  } = filters;

  const query = exceptionRepo
    .createQueryBuilder("request")
    .leftJoinAndSelect("request.employee", "employee")
    .leftJoinAndSelect("request.project", "project")
    .leftJoinAndSelect("request.manager", "manager");

  if (employeeId) {
    query.andWhere("employee.id = :employeeId", { employeeId });
  }

  if (employeeName) {
    query.andWhere("employee.name LIKE :employeeName", {
      employeeName: `%${employeeName}%`,
    });
  }

  if (managerName) {
    query.andWhere("manager.name LIKE :managerName", {
      managerName: `%${managerName}%`,
    });
  }

  if (projectName) {
    query.andWhere("project.name LIKE :projectName", {
      projectName: `%${projectName}%`,
    });
  }

  if (dateFrom && dateTo) {
    query.andWhere("request.submissionDate BETWEEN :dateFrom AND :dateTo", {
      dateFrom,
      dateTo,
    });
  }

  if (currentStatus) {
    query.andWhere("request.currentStatus = :currentStatus", { currentStatus });
  }

  if (exceptionRequestedDays) {
    query.andWhere("request.exceptionRequestedDays = :exceptionRequestedDays", {
      exceptionRequestedDays,
    });
  }

  if (exceptionApprovedDays) {
    query.andWhere("request.exceptionApprovedDays = :exceptionApprovedDays", {
      exceptionApprovedDays,
    });
  }

  return await query.getMany();
};
