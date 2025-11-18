// utils/employeeUtils.js

export const formatEmployeeList = (employees) => {
  return employees.map((emp) => ({
    EmployeeNumber: emp.EmployeeNumber,
    FullName: `${emp.FirstName} ${emp.LastName}`,
    ...(emp?.currentDesignation?.Name && {
      designation: emp.currentDesignation.Name,
    }),
  }));
};
export const sanitizeExceptionRequests = (leaveRequests) => {
  return leaveRequests.map((request) => {
    const {
      employee,
      manager,
      updatedBy,
      ManagerId,
      EmployeeId,
      UpdatedById,
      ...rest
    } = request;

    return {
      ...rest,
      designation: employee?.currentDesignation?.Name || null,
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
