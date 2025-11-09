// src/entities/Designation.js
import { EntitySchema } from "typeorm";

const Designation = new EntitySchema({
  name: "Designation",
  tableName: "Designation",
  schema: "dbo",
  database: "MIMSTEST",
  synchronize: false, // Prevent TypeORM from altering legacy schema
  columns: {
    DesignationId: {
      primary: true,
      type: "bigint",
      generated: false,
    },
    Name: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    Description: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    IsActive: {
      type: "bit",
      nullable: true,
    },
    CreatedBy: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    CreatedOn: {
      type: "datetime",
      nullable: true,
    },
    ModifiedBy: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    ModifiedOn: {
      type: "datetime",
      nullable: true,
    },
  },
});

export default Designation;
