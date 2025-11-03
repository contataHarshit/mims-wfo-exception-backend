// src/entity/UsersInFunctions.js
import { EntitySchema } from "typeorm";

const UsersInFunctions = new EntitySchema({
  name: "UsersInFunctions",
  tableName: "UsersInFunctions",
  schema: "dbo",
  database: "MIMSER",
  synchronize: false, // read-only, TypeORM won't try to create/alter
  columns: {
    UsersInFunctionsId: {
      primary: true,
      type: "int",
      generated: false, // Not marked as IDENTITY in SQL
    },
    UserId: {
      type: "uniqueidentifier",
      nullable: false,
    },
    FunctionId: {
      type: "int",
      nullable: false,
    },
  },
  // Optional: define relations if these tables exist in your models
  relations: {
    user: {
      type: "many-to-one",
      target: "aspnet_Users", // matches your aspnet_Users entity name
      joinColumn: {
        name: "UserId",
        referencedColumnName: "UserId",
      },
      nullable: false,
      eager: true,
    },
  },
});

export default UsersInFunctions;
