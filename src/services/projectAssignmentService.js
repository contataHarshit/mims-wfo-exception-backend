import { AppDataSource } from "../config/data-source.js";
import ProjectAssignment from "../entity/ProjectAssignment.js";

export const getProjectsByEmployeeId = async (employeeId) => {
  console.log("Fetching projects for employeeId:", employeeId);
  AppDataSource.getRepository(ProjectAssignment)
    .find({
      where: { EmployeeID: String(employeeId) },
    })
    .then((projects) => {
      console.log("Projects found:", projects);
    })
    .catch((error) => {
      console.error("Error fetching projects:", error);
    });
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
