import { AppDataSource } from "../config/data-source.js";
import {
  formatEmployeeList,
  formatEmployeeView,
  formatManagerList,
} from "../utils/sanitizedUtils.js";
import Employee from "../entity/legacy/Employee.js";
import EmployeeView from "../entity/legacy/EmployeeView.js";
import { NotFoundError } from "../errors/NotFoundError.js";

const employeeRepo = AppDataSource.getRepository(Employee);
const viewRepo = AppDataSource.getRepository(EmployeeView);

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
    .andWhere("employee.IsActive IN (:...activeValues)", {
      activeValues: [1, 2],
    })
    // .andWhere("employee.EmployeeLocationId = :loc", { loc: 1 })
    .getOne();

  return employee;
};

// ✅ Find employees by ManagerId (pagination optional)
export const findEmployeeByManagerId = async (managerId) => {
  const employees = await viewRepo
    .createQueryBuilder("vw")
    .where("vw.ManagerCode = :managerId", { managerId })
    .orderBy("vw.EmployeeName", "ASC")
    .getMany();

  if (!employees.length) {
    throw new NotFoundError(`No employees found for manager ID "${managerId}"`);
  }

  return { employees: formatEmployeeView(employees), total: employees.length };
};

// ✅ Find all employees (optional pagination)
export const findAllEmployees = async () => {
  const employees = await viewRepo
    .createQueryBuilder("vw")
    .orderBy("vw.EmployeeName", "ASC")
    .getMany();

  if (!employees.length) {
    throw new NotFoundError(`No employees found`);
  }
  return { employees: formatEmployeeView(employees), total: employees.length }; // already in view format
};

// ✅ Find all managers (IsMentor = true)
export const findAllManagers = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const subQuery = viewRepo
    .createQueryBuilder("sub")
    .select("DISTINCT sub.ManagerCode")
    .where("sub.ManagerCode IS NOT NULL");

  const [managers, total] = await Promise.all([
    viewRepo
      .createQueryBuilder("vw")
      .where(`vw.EmployeeCode IN (${subQuery.getQuery()})`)
      .setParameters(subQuery.getParameters())
      .orderBy("vw.EmployeeName", "ASC")
      // .skip(offset)     // ✅ FIXED
      // .take(limit)      // ✅ FIXED
      .getMany(),

    viewRepo
      .createQueryBuilder("vw")
      .where(`vw.EmployeeCode IN (${subQuery.getQuery()})`)
      .setParameters(subQuery.getParameters())
      .getCount(),
  ]);

  return { managers: formatManagerList(managers), total };
};
