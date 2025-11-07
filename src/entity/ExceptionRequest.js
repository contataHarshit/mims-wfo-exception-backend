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
  },
  relations: {
    employee: {
      type: "many-to-one",
      target: "Employee",
      joinColumn: true,
    },
    manager: {
      type: "many-to-one",
      target: "Employee",
      joinColumn: {
        name: "managerId",
      },
      nullable: true,
    },
    updatedBy: {
      type: "many-to-one",
      target: "Employee",
      joinColumn: {
        name: "updatedById",
      },
      nullable: true,
    },
  },
});

export default ExceptionRequest;
