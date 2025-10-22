// src/entity/ExceptionDateRange.js
import { EntitySchema } from "typeorm";

const ExceptionDateRange = new EntitySchema({
  name: "ExceptionDateRange",
  tableName: "ExceptionDateRanges",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    fromDate: {
      type: "date",
    },
    toDate: {
      type: "date",
    },
    primaryReason: {
      type: "text",
    },
    remarks: {
      type: "text",
      nullable: true,
    },
    exceptionRequestedDays: {
      type: "int",
    },
    exceptionApprovedDays: {
      type: "int",
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
  },
  relations: {
    exceptionRequest: {
      type: "many-to-one",
      target: "ExceptionRequest",
      onDelete: "CASCADE",
      joinColumn: true,
    },
  },
});

export default ExceptionDateRange;
