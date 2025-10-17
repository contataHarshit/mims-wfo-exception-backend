import e from "express";
import { findEmployeeById } from "../services/employeeService.js";
import { getProjectsByEmployeeId } from "../services/projectAssignmentService.js";
import logger from "../utils/logger.js";

export const getEmployee = async (req, res) => {
  try {
    // Always use employeeId from the JWT token if available
    const employeeId = req.user?.employeeId;
    const employee = await findEmployeeById(employeeId);
    const projects = await getProjectsByEmployeeId(String(employee.EmployeeId));
    const result = {
      employeeId: employee.EmployeeId,
      employeeName: [employee.FirstName, employee.MiddleName, employee.LastName]
        .filter(Boolean)
        .join(" "),
      managerName: null,
      projects: projects.map((p) => ({
        id: p.ProjectId,
        name: p.ProjectName,
      })),
    };
    if (employee?.ManagerId) {
      const manager = await findEmployeeById(employee?.ManagerId);
      if (manager) {
        result.managerName = {
          EmployeeId: manager.EmployeeId,
          name: `${manager.FirstName} ${manager.LastName}`,
        };
      }
    }

    res.json(result);
  } catch (error) {
    console.log(error);
    logger.error(error);
    res.status(500).json({ message: "Error fetching Employee requests" });
  }
};
