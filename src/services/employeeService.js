import { AppDataSource } from "../config/data-source.js";
const employeeRepo = AppDataSource.getRepository("Employee");

export const findEmployeeByNumber = async (employeeNumber) => {
  console.log(employeeNumber);
  const employee = await employeeRepo.findOne({
    where: { EmployeeNumber: String(employeeNumber) }, // EmployeeNumber is varchar
  });

  if (!employee) {
    throw new Error(`Employee by number ${employeeNumber} not found`);
  }

  return employee;
};

export const findEmployeeById = async (EmployeeId) => {
  console.log(EmployeeId,"DATAAAAAAAAAAAAAAAA");
  const employee = await employeeRepo.findOne({
    where: { EmployeeId: parseInt(EmployeeId, 10) }, // EmployeeId is int
  });

  if (!employee) {
    throw new Error(`Employee by id ${EmployeeId} not found`);
  }

  return employee;
};
