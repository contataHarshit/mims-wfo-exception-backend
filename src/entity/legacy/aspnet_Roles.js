// src/entity/aspnet_Roles.js
import { EntitySchema } from "typeorm";

const AspnetRoles = new EntitySchema({
  name: "aspnet_Roles",
  tableName: "aspnet_Roles",
  schema: "dbo",
  database: "MIMSTEST",
  synchronize: false, // read-only, TypeORM won't try to create/alter
  columns: {
    ApplicationId: {
      type: "uniqueidentifier",
      nullable: false,
    },
    RoleId: {
      primary: true,
      type: "uniqueidentifier",
      generated: false,
    },
    RoleName: {
      type: "nvarchar",
      length: 256,
      nullable: true,
      collation: "SQL_Latin1_General_CP1_CI_AS",
    },
    LoweredRoleName: {
      type: "nvarchar",
      length: 256,
      nullable: true,
      collation: "SQL_Latin1_General_CP1_CI_AS",
    },
    Description: {
      type: "nvarchar",
      length: 256,
      nullable: true,
      collation: "SQL_Latin1_General_CP1_CI_AS",
    },
  },
});

export default AspnetRoles;
