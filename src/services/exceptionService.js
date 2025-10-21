import { AppDataSource } from "../config/data-source.js";
import { NotFoundError } from "../errors/NotFoundError.js";

const exceptionRepo = AppDataSource.getRepository("ExceptionRequest");

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

export const updateException = async (id, updateData) => {
  const existing = await exceptionRepo.findOneBy({ id });

  if (!existing) {
    throw new NotFoundError(`Exception request with ID "${id}" not found`);
  }

  exceptionRepo.merge(existing, updateData);
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

  //  Role-based data restriction
  if (role === "EMPLOYEE") {
    query.andWhere("employee.EmployeeId = :employeeId", { employeeId });
  } else if (role === "MANAGER") {
    query.andWhere("manager.EmployeeId = :employeeId", { employeeId });
  }
  // HR and ADMIN can view all records

  //  Filtering
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
    query.andWhere("request.currentStatus = :currentStatus", { currentStatus });
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

  //  Pagination
  query.skip((page - 1) * limit).take(limit);

  const [data, total] = await query.getManyAndCount();

  //  Formatting response
  return {
    data: data.map((exception) => ({
      ...exception,
      employeeName: `${exception.employee.FirstName} ${exception.employee.LastName}`,
      employeeNumber: exception.employee.EmployeeNumber,
      managerName: `${exception.manager.FirstName} ${exception.manager.LastName}`,
      projectName: exception.project.ProjectName,
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
