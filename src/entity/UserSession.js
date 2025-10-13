// src/entity/UserSession.js
import { EntitySchema } from "typeorm";

const UserSession = new EntitySchema({
  name: "UserSession",
  tableName: "UserSessions",
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
