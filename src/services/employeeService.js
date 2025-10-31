import { AppDataSource } from "../config/data-source.js";
import { formatEmployeeList } from "../utils/sanitizedUtils.js";
import Employee from "../entity/legacy/Employee.js";
import { NotFoundError } from "../errors/NotFoundError.js";

const employeeRepo = AppDataSource.getRepository(Employee);

export const findEmployeeByNumber = async (employeeNumber) => {
  const employee = await employeeRepo.findOne({
    where: { EmployeeNumber: String(employeeNumber) }, // varchar
  });

  if (!employee) {
    throw new NotFoundError(
      `Employee with number "${employeeNumber}" not found`
    );
  }

  return employee;
};

export const findEmployeeById = async (employeeId) => {
  const employee = await employeeRepo.findOne({
    where: { EmployeeId: parseInt(employeeId, 10) }, // int
  });

  if (!employee) {
    throw new NotFoundError(`Employee with ID "${employeeId}" not found`);
  }

  return employee;
};

export const findEmployeeByManagerId = async (
  managerId,
  page = 1,
  limit = 10
) => {
  const offset = (page - 1) * limit;

  const [employees, total] = await employeeRepo.findAndCount({
    where: { ManagerId: parseInt(managerId, 10) },
    skip: offset,
    take: parseInt(limit, 10),
    order: { EmployeeId: "ASC" },
  });

  if (!employees || employees.length === 0) {
    throw new NotFoundError(`No employees found for manager ID "${managerId}"`);
  }

  return { employees: formatEmployeeList(employees), total };
};

export const findAllEmployees = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const [employees, total] = await employeeRepo.findAndCount({
    skip: offset,
    take: parseInt(limit, 10),
    order: { EmployeeId: "ASC" },
  });

  if (!employees || employees.length === 0) {
    throw new NotFoundError(`No employees found`);
  }

  return { employees: formatEmployeeList(employees), total };
};
