import { AppDataSource } from "../config/data-source.js";
import { formatEmployeeList } from "../utils/employeeUtils.js";
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

export const findEmployeeByManagerId = async (managerId) => {
  const employees = await employeeRepo.find({
    where: { ManagerId: parseInt(managerId, 10) },
  });

  if (!employees || employees.length === 0) {
    throw new NotFoundError(`No employees found for manager ID "${managerId}"`);
  }

  return formatEmployeeList(employees);
};

export const findAllEmployees = async () => {
  const employees = await employeeRepo.find();

  if (!employees || employees.length === 0) {
    throw new NotFoundError(`No employees found`);
  }

  return formatEmployeeList(employees);
};
