// src/entity/ExceptionRequest.js
import { EntitySchema } from "typeorm";
import Employee from "./Employee.js";
import ProjectAssignment from "./ProjectAssignment.js";

const ExceptionRequest = new EntitySchema({
  name: "ExceptionRequest",
  tableName: "ExceptionRequests",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    exceptionDateRange: {
      type: "varchar", // or "text" if preferred
    },
    primaryReason: {
      type: "text",
    },
    submissionDate: {
      type: "date",
    },
    exceptionRequestedDays: {
      type: "int",
    },
    exceptionApprovedDays: {
      type: "int",
      nullable: true,
    },
    approvalDate: {
      type: "date",
      nullable: true,
    },
    currentStatus: {
      type: "varchar",
      default: "PENDING",
    },
    managerRemarks: {
      type: "text",
      nullable: true,
    },
    action: {
      type: "varchar",
    },
  },
  relations: {
    employee: {
      type: "many-to-one",
      target: "Employee",
      eager: true,
      joinColumn: true,
    },
    manager: {
      type: "many-to-one",
      target: "Employee", // Manager is also an Employee entity
      eager: true,
      joinColumn: {
        name: "managerId",
      },
    },
    project: {
      type: "many-to-one",
      target: "ProjectAssignment",
      eager: true,
      joinColumn: true,
    },
  },
});

export default ExceptionRequest;
