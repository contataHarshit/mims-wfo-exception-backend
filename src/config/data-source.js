import { DataSource } from "typeorm";
import dotenv from "dotenv";
import ExceptionDateRange from "../entity/ExceptionDateRange.js";
import ExceptionRequest from "../entity/ExceptionRequest.js";
import Employee from "../entity/legacy/Employee.js";
import ProjectAssignment from "../entity/legacy/ProjectAssignment.js";
import UserSession from "../entity/legacy/UserSession.js";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mssql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  debug: true,
  logging: ["error"], // Enable query and error logging
  entities: [
    ExceptionRequest,
    ExceptionDateRange,
    Employee,
    ProjectAssignment,
    UserSession /* add other entities here */,
  ],
  options: {
    encrypt: true, // required for Azure; usually safe to leave true
    trustServerCertificate: true, // allow self-signed certs (for local dev)
  },
});
