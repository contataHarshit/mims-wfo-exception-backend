// src/services/userService.js
import { AppDataSource } from "../config/data-source.js";
import AspnetUsers from "../entity/legacy/aspnet_Users.js";
import AspnetUsersInRoles from "../entity/legacy/aspnet_UsersInRoles.js";
import AspnetRoles from "../entity/legacy/aspnet_Roles.js";
import UsersInFunctions from "../entity/legacy/UsersInFunctions.js";

export const getUserRoleByWindowsName = async (windowsName) => {
  const userNameLower = windowsName.toLowerCase();

  // 1️⃣ Get user from aspnet_Users
  const aspnetUser = await AppDataSource.createQueryBuilder()
    .select("user")
    .from(AspnetUsers, "user")
    .where("user.LoweredUserName = :userName", { userName: userNameLower })
    .getOne();

  if (!aspnetUser) {
    console.warn(`User not found: ${windowsName}`);
    return null;
  }

  const userId = aspnetUser.UserId;

  // 2️⃣ Get user roles (joining aspnet_UsersInRoles and aspnet_Roles)
  const userRoles = await AppDataSource.createQueryBuilder()
    .select("role.RoleName", "RoleName")
    .from(AspnetUsersInRoles, "uir")
    .innerJoin(AspnetRoles, "role", "uir.RoleId = role.RoleId")
    .where("uir.UserId = :userId", { userId })
    .getRawMany();

  if (!userRoles || userRoles.length === 0) {
    return { role: "EMPLOYEE" };
  }

  const primaryRole = userRoles[0].RoleName.toUpperCase();

  // 3️⃣ Check roles & functions
  if (primaryRole === "ADMIN") {
    return { role: "ADMIN", department: "MANAGMENT" };
  }

  if (primaryRole === "MANAGER") {
    const userFunctions = await AppDataSource.createQueryBuilder()
      .select("uf")
      .from(UsersInFunctions, "uf")
      .where("uf.UserId = :userId", { userId })
      .andWhere("uf.FunctionId = :functionId", { functionId: 1 })
      .getRawMany();

    if (userFunctions.length > 0) {
      return { role: "MANAGER", department: "HR" };
    } else {
      return { role: "MANAGER", department: "IT" };
    }
  }

  // 4️⃣ Check HR function for employee
  const userFunctionsForAllHR = await AppDataSource.createQueryBuilder()
    .select("uf")
    .from(UsersInFunctions, "uf")
    .where("uf.UserId = :userId", { userId })
    .andWhere("uf.FunctionId = :functionId", { functionId: 1 })
    .getRawMany();

  if (userFunctionsForAllHR.length > 0) {
    return { role: "EMPLOYEE", department: "HR" };
  }

  // 5️⃣ Default role for others
  return { role: "EMPLOYEE", department: "IT" };
};
