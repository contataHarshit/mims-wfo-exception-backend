import { EntitySchema } from "typeorm";

const ExceptionRequest = new EntitySchema({
  name: "ExceptionRequest",
  tableName: "ExceptionRequests",
  schema: "dbo",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    submissionDate: {
      type: "datetime",
      createDate: true,
    },
    updatedDate: {
      type: "datetime",
      updateDate: true,
    },
    selectedDate: {
      type: "date",
      nullable: false,
    },
    primaryReason: {
      type: "varchar",
      length: "max",
      nullable: false,
    },
    remarks: {
      type: "varchar",
      length: "max",
      nullable: false,
    },
    currentStatus: {
      type: "varchar",
      length: 50,
      nullable: false,
      default: "PENDING",
    },
    updatedByRole: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    approvedBy: {
      type: "varchar",
      length: "max",
      nullable: true,
    },
    reviewRemarks: {
      type: "varchar",
      length: "max",
      nullable: true,
    },
    rejectedBy: {
      type: "varchar",
      length: "max",
      nullable: true,
    },
    EmployeeId: { type: "bigint", nullable: true },
    ManagerId: { type: "bigint", nullable: true },
    UpdatedById: { type: "bigint", nullable: true },
  },
  relations: {
    employee: {
      type: "many-to-one",
      target: "Employee",
      joinColumn: {
        name: "EmployeeId", // ✅ correct FK name
        referencedColumnName: "EmployeeId",
      },
      nullable: true,
    },
    manager: {
      type: "many-to-one",
      target: "Employee",
      joinColumn: {
        name: "ManagerId",
        referencedColumnName: "EmployeeId",
      },
      nullable: true,
    },
    updatedBy: {
      type: "many-to-one",
      target: "Employee",
      joinColumn: {
        name: "UpdatedById",
        referencedColumnName: "EmployeeId",
      },
      nullable: true,
    },
  },
});

export default ExceptionRequest;
