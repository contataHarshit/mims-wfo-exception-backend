// src/entity/aspnet_UsersInRoles.js
import { EntitySchema } from "typeorm";

const AspnetUsersInRoles = new EntitySchema({
  name: "aspnet_UsersInRoles",
  tableName: "aspnet_UsersInRoles",
  schema: "dbo",
  database: "MIMSER",
  synchronize: false, // read-only, TypeORM won't try to create/alter
  columns: {
    UserId: {
      type: "uniqueidentifier",
      primary: true,
    },
    RoleId: {
      type: "uniqueidentifier",
      primary: true,
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "aspnet_Users",
      joinColumn: {
        name: "UserId",
        referencedColumnName: "UserId",
      },
      nullable: false,
      eager: true,
    },
    role: {
      type: "many-to-one",
      target: "aspnet_Roles",
      joinColumn: {
        name: "RoleId",
        referencedColumnName: "RoleId",
      },
      nullable: false,
      eager: true,
    },
  },
});

export default AspnetUsersInRoles;
