import { AppDataSource } from "../config/data-source.js";
import ProjectAssignment from "../entity/ProjectAssignment.js";

export const getProjectsByEmployeeId = async (employeeId) => {
  return await AppDataSource.getRepository(ProjectAssignment).find({
    where: { EmployeeID: String(employeeId) },
    select: [
      "ProjectId",
      "ProjectName",
      "ProjectManagerID",
      "ProjectManagerName",
    ],
  });
};
