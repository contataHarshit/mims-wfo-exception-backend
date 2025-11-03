// src/services/userService.js
import { AppDataSource } from "../config/data-source.js";
import AspnetUsers from "../entity/legacy/aspnet_Users.js";
import AspnetUsersInRoles from "../entity/legacy/aspnet_UsersInRoles.js";
import AspnetRoles from "../entity/legacy/aspnet_Roles.js";
import UsersInFunctions from "../entity/legacy/UsersInFunctions.js";

export const getUserRoleByWindowsName = async (windowsName) => {
  const userNameLower = windowsName.toLowerCase();

  const usersRepository = AppDataSource.getRepository(AspnetUsers);
  const usersInRolesRepository =
    AppDataSource.getRepository(AspnetUsersInRoles);
  const usersInFunctionsRepository =
    AppDataSource.getRepository(UsersInFunctions);

  // 1️⃣ Get user from aspnet_Users
  const aspnetUser = await usersRepository.findOne({
    where: { LoweredUserName: userNameLower },
  });

  if (!aspnetUser) {
    console.warn(`User not found: ${windowsName}`);
    return null;
  }

  const userId = aspnetUser.UserId;

  // 2️⃣ Get user roles (with role relation)
  const userRoles = await usersInRolesRepository.find({
    where: { UserId: userId },
    relations: ["role"],
  });

  if (!userRoles || userRoles.length === 0) {
    return { role: "EMPLOYEE" }; // default fallback
  }

  // 3️⃣ Get the main role (assuming one primary role per user)
  const primaryRole = userRoles[0].role.RoleName.toUpperCase();

  // 4️⃣ Apply logic
  if (primaryRole === "ADMIN") {
    return { role: "ADMIN" };
  }

  if (primaryRole === "MANAGER") {
    // Check if FunctionId = 1 exists
    const userFunctions = await usersInFunctionsRepository.find({
      where: { UserId: userId, FunctionId: 1 },
    });

    if (userFunctions && userFunctions.length > 0) {
      return { role: "HR" };
    } else {
      return { role: "MANAGER" };
    }
  }

  // 5️⃣ Default role for others
  return { role: "EMPLOYEE" };
};
