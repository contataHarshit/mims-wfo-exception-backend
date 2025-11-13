import { DataSource } from "typeorm";
import dotenv from "dotenv";
import ExceptionRequest from "../entity/ExceptionRequest.js";
import Employee from "../entity/legacy/Employee.js";
import WFH_UserSessions from "../entity/legacy/WFH_UserSessions.js";
import AspnetRoles from "../entity/legacy/aspnet_Roles.js";
import AspnetUsers from "../entity/legacy/aspnet_Users.js";
import AspnetUsersInRoles from "../entity/legacy/aspnet_UsersInRoles.js";
import UsersInFunctions from "../entity/legacy/UsersInFunctions.js";
import Designation from "../entity/legacy/Designation.js";
import HolidayList from "../entity/legacy/HolidayList.js";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "mssql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  debug: true,
  logging: ["error"], // Enable query and error logging
  entities: [
    ExceptionRequest,
    Employee,
    WFH_UserSessions,
    AspnetRoles,
    AspnetUsers,
    AspnetUsersInRoles,
    UsersInFunctions,
    Designation /* add other entities here */,
    HolidayList,
  ],
  migrations: ["./src/migration/*.js"], // note the "./" at the start
  extra: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  },
});
