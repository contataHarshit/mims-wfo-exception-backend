import { AppDataSource } from "../config/data-source.js";
import ProjectAssignment from "../entity/ProjectAssignment.js";
import { ServiceError } from "../errors/ServiceError.js";

export const getProjectsByEmployeeId = async (employeeId) => {
  try {
    return await AppDataSource.getRepository(ProjectAssignment).find({
      where: { EmployeeID: String(employeeId) },
      select: [
        "ProjectId",
        "ProjectName",
        "ProjectManagerID",
        "ProjectManagerName",
      ],
    });
  } catch (error) {
    // Wrap and rethrow with a custom message
    throw new ServiceError(
      `Failed to fetch projects for employee ID ${employeeId}: ${error.message}`,
      500
    );
  }
};
