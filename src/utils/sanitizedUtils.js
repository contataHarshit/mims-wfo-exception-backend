// utils/employeeUtils.js

export const formatEmployeeList = (employees) => {
  return employees.map((emp) => ({
    EmployeeNumber: emp.EmployeeNumber,
    FullName: `${emp.FirstName} ${emp.LastName}`,
    designation: emp?.currentDesignation?.Name || null,
  }));
};
export const sanitizeExceptionRequests = (leaveRequests) => {
  return leaveRequests.map((request) => {
    const { employee, manager, updatedBy, ...rest } = request;

    return {
      ...rest,
      employeeNumber: employee ? employee?.EmployeeNumber : null, // optional — or hide completely
      employee: employee
        ? `${employee?.FirstName || ""} ${employee?.LastName || ""}`.trim()
        : null,
      manager: manager
        ? `${manager?.FirstName || ""} ${manager?.LastName || ""}`.trim()
        : null,
      updatedBy: updatedBy
        ? `${updatedBy?.FirstName || ""} ${updatedBy?.LastName || ""}`.trim()
        : null,
    };
  });
};
