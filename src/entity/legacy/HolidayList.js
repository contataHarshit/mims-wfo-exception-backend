import { EntitySchema } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

const HolidayList = new EntitySchema({
  name: "HolidayList",
  tableName: "HolidayList",
  schema: "dbo",
  database: process.env.DB_NAME, // optional if you set DB in data-source config
  synchronize: false, // do not auto-create/alter
  columns: {
    HolidayId: {
      primary: true,
      type: "bigint",
      generated: false, // NOT IDENTITY in your SQL
      nullable: false,
    },
    Holiday: {
      type: "varchar",
      length: 50,
      nullable: true,
      collation: "SQL_Latin1_General_CP1_CI_AS",
    },
    LeaveType: {
      type: "nchar",
      length: 10,
      nullable: true,
      collation: "SQL_Latin1_General_CP1_CI_AS",
    },
    LeaveOn: {
      type: "datetime",
      nullable: true,
    },
    Year: {
      type: "int",
      nullable: true,
    },
  },
});

export default HolidayList;
