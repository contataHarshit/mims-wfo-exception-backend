import { AppDataSource } from "../config/data-source.js";
import { formatEmployeeList } from "../utils/sanitizedUtils.js";
import Employee from "../entity/legacy/Employee.js";
import { NotFoundError } from "../errors/NotFoundError.js";

const employeeRepo = AppDataSource.getRepository(Employee);

// ✅ Find employee by EmployeeNumber (varchar)
export const findEmployeeByNumber = async (employeeNumber) => {
  const employee = await employeeRepo
    .createQueryBuilder("employee")
    .where("employee.EmployeeNumber = :employeeNumber", { employeeNumber })
    .getOne();

  if (!employee) {
    throw new NotFoundError(
      `Employee with number "${employeeNumber}" not found`
    );
  }

  return employee;
};

// ✅ Find employee by EmployeeId (int)
export const findEmployeeById = async (employeeId) => {
  const employee = await employeeRepo
    .createQueryBuilder("employee")
    .where("employee.EmployeeId = :employeeId", { employeeId })
    .getOne();

  if (!employee) {
    throw new NotFoundError(`Employee with ID "${employeeId}" not found`);
  }

  return employee;
};

// ✅ Find employees by ManagerId (pagination optional)
export const findEmployeeByManagerId = async (
  managerId,
  page = 1,
  limit = 10
) => {
  const offset = (page - 1) * limit;

  const [employees, total] = await Promise.all([
    employeeRepo
      .createQueryBuilder("employee")
      .where("employee.ManagerId = :managerId", { managerId })
      .orderBy("employee.EmployeeId", "ASC")
      // Uncomment if you want pagination:
      // .skip(offset)
      // .take(limit)
      .getMany(),
    employeeRepo
      .createQueryBuilder("employee")
      .where("employee.ManagerId = :managerId", { managerId })
      .getCount(),
  ]);

  if (!employees.length) {
    throw new NotFoundError(`No employees found for manager ID "${managerId}"`);
  }

  return { employees: formatEmployeeList(employees), total };
};

// ✅ Find all employees (optional pagination)
export const findAllEmployees = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const [employees, total] = await Promise.all([
    employeeRepo
      .createQueryBuilder("employee")
      .orderBy("employee.EmployeeId", "ASC")
      // Uncomment to enable pagination:
      // .skip(offset)
      // .take(limit)
      .getMany(),
    employeeRepo.createQueryBuilder("employee").getCount(),
  ]);

  if (!employees.length) {
    throw new NotFoundError(`No employees found`);
  }

  return { employees: formatEmployeeList(employees), total };
};

// ✅ Find all managers (IsMentor = true)
export const findAllManagers = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const [managers, total] = await Promise.all([
    employeeRepo
      .createQueryBuilder("employee")
      .leftJoinAndSelect("employee.currentDesignation", "designation")
      .where("employee.IsMentor = :isMentor", { isMentor: true })
      .orderBy("employee.FirstName", "ASC")
      // Uncomment if pagination needed:
      // .skip(offset)
      // .take(limit)
      .getMany(),
    employeeRepo
      .createQueryBuilder("employee")
      .where("employee.IsMentor = :isMentor", { isMentor: true })
      .getCount(),
  ]);

  if (!managers.length) {
    throw new NotFoundError(`No managers found`);
  }

  return { managers: formatEmployeeList(managers), total };
};
