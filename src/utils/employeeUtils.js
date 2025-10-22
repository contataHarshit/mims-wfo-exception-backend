// utils/employeeUtils.js

export const formatEmployeeList = (employees) => {
  return employees.map((emp) => ({
    EmployeeNumber: emp.EmployeeNumber,
    FullName: `${emp.FirstName} ${emp.LastName}`,
  }));
};
