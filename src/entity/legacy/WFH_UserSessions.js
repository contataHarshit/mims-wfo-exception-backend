// src/entity/UserSession.js
import { EntitySchema } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

const WFH_UserSessions = new EntitySchema({
  name: "WFH_UserSessions",
  tableName: "WFH_UserSessions",
  schema: "dbo",
  database: process.env.DB_NAME,
  synchronize: false, // read-only, TypeORM won't try to create/alter
  columns: {
    ClientConnId: {
      type: "nvarchar",
      length: 50,
      primary: true,
      nullable: false,
    },
    SessionData: {
      type: "nvarchar",
      nullable: true,
    },
    LastActivity: {
      type: "datetime",
      nullable: false,
    },
  },
});

export default WFH_UserSessions;
