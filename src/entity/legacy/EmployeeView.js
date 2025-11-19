import { EntitySchema } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

const EmployeeView = new EntitySchema({
  name: "EmployeeView",
  tableName: "vw_ActiveEmployeeSummary",
  schema: "dbo",
  database: process.env.DB_NAME,
  synchronize: false,

  columns: {
    EmployeeCode: {
      type: "varchar",
      primary: true, // ✅ REQUIRED
    },
    EmployeeName: { type: "varchar", nullable: true },
    ManagerName: { type: "varchar", nullable: true },
    ManagerCode: { type: "varchar", nullable: true },
    EmployeeEmail: { type: "varchar", nullable: true },
    EmployeeDesignation: { type: "varchar", nullable: true },
    HRRepresentativeName: { type: "varchar", nullable: true },
    DateOfJoining: { type: "datetime", nullable: true },
  },
});

export default EmployeeView;
