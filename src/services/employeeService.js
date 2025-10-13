// src/services/employeeService.js
import { AppDataSource } from "../config/data-source.js";

export const findEmployeeByNumber = async (employeeNumber) => {
  const employeeRepo = AppDataSource.getRepository("Employee");

  const employee = await employeeRepo.findOne({
    where: { EmployeeNumber: employeeNumber },
  });

  if (!employee) {
    throw new Error({ message: "Employee not found" });
  }

  return employee;
};
