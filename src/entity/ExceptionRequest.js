// src/entity/ExceptionRequest.js
import { EntitySchema } from "typeorm";

const ExceptionRequest = new EntitySchema({
  name: "ExceptionRequest",
  tableName: "ExceptionRequests",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    approvalDate: {
      type: "date",
      nullable: true,
    },
    action: {
      type: "varchar",
    },
    submissionDate: {
      type: "datetime", // ✅ fixed
      createDate: true,
    },
    updatedDate: {
      type: "datetime", // ✅ fixed
      updateDate: true,
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
      target: "Employee",
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
    exceptions: {
      type: "one-to-many",
      target: "ExceptionDateRange",
      inverseSide: "exceptionRequest",
      cascade: true,
      eager: true,
    },
  },
});

export default ExceptionRequest;
