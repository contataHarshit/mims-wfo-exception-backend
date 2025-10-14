// src/services/exceptionService.js
import { AppDataSource } from "../config/data-source.js";

const exceptionRepo = AppDataSource.getRepository("ExceptionRequest");

export const createException = async (data) => {
  const {
    employeeId,
    managerId,
    projectId,
    action,
    exceptionRequestedDays,
    exceptions, // array of fromDate, toDate, reason, remarks
  } = data;

  const exception = exceptionRepo.create({
    employee: { EmployeeId: employeeId },
    manager: { EmployeeId: managerId },
    project: { id: projectId },
    action,
    exceptionRequestedDays,
    exceptions, // this will be saved via cascade
  });

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
    .leftJoin("request.employee", "employee")
    .leftJoin("request.project", "project")
    .leftJoin("request.manager", "manager")
    .leftJoinAndSelect("request.exceptions", "exceptionDetails")
    // Select all columns from request (exception)
    .addSelect([
      "employee.FirstName",
      "employee.LastName",
      "project.ProjectName",
      "manager.FirstName",
      "manager.LastName",
    ]);

  if (employeeName) {
    query.andWhere(
      "(employee.FirstName LIKE :employeeName OR employee.LastName LIKE :employeeName)",
      { employeeName: `%${employeeName}%` }
    );
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

  const results = await query.getRawAndEntities();

  // getRawAndEntities returns:
  // results.entities = array of full 'request' entities (exception data)
  // results.raw = array of raw query rows including selected joined fields

  // Now merge the names into each exception object:
  return results.entities.map((exception, index) => {
    const raw = results.raw[index];
    return {
      ...exception,
      employeeName: `${raw["employee_FirstName"]} ${raw["employee_LastName"]}`,
      projectName: raw["project_ProjectName"],
      managerName: `${raw["manager_FirstName"]} ${raw["manager_LastName"]}`,
    };
  });
};
