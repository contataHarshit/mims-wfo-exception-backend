// src/entity/UserSession.js
import { EntitySchema } from "typeorm";

const UserSession = new EntitySchema({
  name: "UserSession",
  tableName: "UserSessions",
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

export default UserSession;
