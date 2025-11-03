// src/entity/aspnet_Users.js
import { EntitySchema } from "typeorm";

const AspnetUsers = new EntitySchema({
  name: "aspnet_Users",
  tableName: "aspnet_Users",
  schema: "dbo",
  database: "MIMSER",
  synchronize: false, // read-only, TypeORM won't try to create/alter
  columns: {
    ApplicationId: {
      type: "uniqueidentifier",
      nullable: false,
    },
    UserId: {
      primary: true,
      type: "uniqueidentifier",
      generated: false, // Not auto-generated in SQL
    },
    UserName: {
      type: "nvarchar",
      length: 256,
      nullable: true,
      collation: "SQL_Latin1_General_CP1_CI_AS",
    },
    LoweredUserName: {
      type: "nvarchar",
      length: 256,
      nullable: true,
      collation: "SQL_Latin1_General_CP1_CI_AS",
    },
    MobileAlias: {
      type: "nvarchar",
      length: 16,
      nullable: true,
      collation: "SQL_Latin1_General_CP1_CI_AS",
    },
    IsAnonymous: {
      type: "bit",
      nullable: false,
    },
    LastActivityDate: {
      type: "datetime",
      nullable: false,
    },
  },
});

export default AspnetUsers;
