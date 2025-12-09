// src/entity/LeaveInformation.js
import { EntitySchema } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

const LeaveInformation = new EntitySchema({
  name: "LeaveInformation",
  tableName: "LeaveInformation",
  schema: "dbo",
  database: process.env.DB_NAME,
  synchronize: false, // prevents TypeORM from altering the table

  columns: {
    LeaveInformationId: {
      primary: true,
      type: "bigint",
      generated: false,
    },

    EmployeeId: {
      type: "bigint",
      nullable: false,
    },

    LeaveType: {
      type: "varchar",
      nullable: true,
    },

    FromDate: {
      type: "datetime",
      nullable: true,
    },

    ToDate: {
      type: "datetime",
      nullable: true,
    },

    Reason: {
      type: "varchar",
      nullable: true,
    },

    ProcessingDate: {
      type: "datetime",
      nullable: true,
    },

    ApprovedByManagerId: {
      type: "bigint",
      nullable: true,
    },

    Remarks: {
      type: "varchar",
      nullable: true,
    },

    IsApproved: {
      type: "bit",
      nullable: true,
    },

    IsCancelled: {
      type: "bit",
      nullable: true,
    },

    CancelDate: {
      type: "datetime",
      nullable: true,
    },

    CancelReason: {
      type: "varchar",
      nullable: true,
    },

    Days: {
      type: "decimal",
      nullable: true,
      precision: 10,
      scale: 2,
    },

    FirstHalf: {
      type: "bit",
      nullable: true,
    },

    SecondHalf: {
      type: "bit",
      nullable: true,
    },

    AppliedDate: {
      type: "datetime",
      nullable: true,
    },

    CreatedDateTime: {
      type: "datetime",
      nullable: true,
    },
  },
});

export default LeaveInformation;
