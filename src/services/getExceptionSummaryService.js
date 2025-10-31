import { AppDataSource } from "../config/data-source.js";
import { Between, ILike } from "typeorm";
import ExceptionRequest from "../entity/ExceptionRequest.js";
import Employee from "../entity/legacy/Employee.js";

const exceptionRepo = AppDataSource.getRepository(ExceptionRequest);
const employeeRepo = AppDataSource.getRepository(Employee);

// 🔹 Utility to build the exception summary for a given employee
const getEmployeeSummary = async (emp, dateFilter, reason) => {
  // Fetch manager if exists
  let managerName = "NA";
  if (emp.ManagerId) {
    const manager = await employeeRepo.findOne({
      where: { EmployeeId: emp.ManagerId },
    });
    if (manager) {
      managerName = `${manager.FirstName || ""} ${
        manager.LastName || ""
      }`.trim();
    }
  }

  // Fetch exception requests for this employee
  const requests = await exceptionRepo.find({
    where: {
      ...dateFilter,
      employee: { EmployeeId: emp.EmployeeId },
      ...(reason && { primaryReason: ILike(`%${reason}%`) }),
    },
  });

  const APPROVED = requests.filter(
    (x) => x.currentStatus === "APPROVED"
  ).length;
  const REJECTED = requests.filter(
    (x) => x.currentStatus === "REJECTED"
  ).length;
  const PENDING = requests.filter((x) => x.currentStatus === "PENDING").length;

  return {
    employeeId: emp.EmployeeId,
    employeeNumber: emp.EmployeeNumber,
    employeeName: `${emp.FirstName || ""} ${emp.LastName || ""}`.trim(),
    designation:
      emp.CurrentDesignationId != null
        ? emp.CurrentDesignationId.toString()
        : "NA",
    managerName,
    APPROVED,
    REJECTED,
    PENDING,
    TOTAL: requests.length,
  };
};

// 🔹 Main service
export const getExceptionSummaryService = async ({
  fromDate,
  toDate,
  employeeNumber,
  managerEmployeeNumber,
  reason,
  filterType,
  page = 1,
  limit = 10,
}) => {
  filterType = (filterType || "ALL").trim().toUpperCase();

  const dateFilter =
    fromDate && toDate
      ? { selectedDate: Between(new Date(fromDate), new Date(toDate)) }
      : {};

  // CASE 1: Specific employee
  if (filterType === "EMPLOYEE" && employeeNumber) {
    const employee = await employeeRepo.findOne({
      where: { EmployeeNumber: ILike(`%${employeeNumber}%`) },
    });

    if (!employee) {
      return {
        page,
        limit,
        totalRecords: 0,
        data: [],
        message: "No employee found with this employee number.",
      };
    }

    const summary = await getEmployeeSummary(employee, dateFilter, reason);
    return { page, limit, totalRecords: 1, data: [summary] };
  }

  // CASE 2: Manager (team members)
  if (filterType === "MANAGER" && managerEmployeeNumber) {
    const manager = await employeeRepo.findOne({
      where: { EmployeeNumber: ILike(`%${managerEmployeeNumber}%`) },
    });
    if (!manager) return { message: "Manager not found." };

    const [teamMembers, totalMembers] = await employeeRepo.findAndCount({
      where: { ManagerId: manager.EmployeeId },
      skip: (page - 1) * limit,
      take: limit,
    });

    if (!teamMembers.length)
      return {
        page,
        limit,
        totalRecords: 0,
        data: [],
        message: "This manager has no direct reports.",
      };

    const teamSummary = await Promise.all(
      teamMembers.map((emp) => getEmployeeSummary(emp, dateFilter, reason))
    );

    return {
      page,
      limit,
      totalRecords: totalMembers,
      totalPages: Math.ceil(totalMembers / limit),
      data: teamSummary,
    };
  }

  // CASE 3: All employees
  const [employees, totalEmployees] = await employeeRepo.findAndCount({
    where: employeeNumber
      ? { EmployeeNumber: ILike(`%${employeeNumber}%`) }
      : {},
    skip: (page - 1) * limit,
    take: limit,
  });

  const summaries = await Promise.all(
    employees.map((emp) => getEmployeeSummary(emp, dateFilter, reason))
  );

  return {
    page,
    limit,
    totalRecords: totalEmployees,
    totalPages: Math.ceil(totalEmployees / limit),
    data: summaries,
  };
};
