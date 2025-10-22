import { EntitySchema } from "typeorm";

const ProjectAssignment = new EntitySchema({
  name: "ProjectAssignment",
  tableName: "ProjectAssignments",
  columns: {
    ProjectId: {
      primary: true,
      type: "int",
      // If it's generated (auto increment), add generated: true,
      // But since it's a PrimaryColumn (not generated), omit this
    },
    ProjectName: {
      type: "varchar",
      length: 512,
      nullable: false,
    },
    EmployeeID: {
      type: "varchar",
      length: 12,
      nullable: false,
    },
    EmployeeName: {
      type: "varchar",
      length: 150,
      nullable: false,
    },
    ProjectManagerID: {
      type: "varchar",
      length: 10,
      nullable: true,
    },
    ProjectManagerName: {
      type: "varchar",
      length: 150,
      nullable: true,
    },
    Role: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    ProjectStartDate: {
      type: "date",
      nullable: false,
    },
    ProjectEndDate: {
      type: "date",
      nullable: false,
    },
    EmpProjectJoinDate: {
      type: "date",
      nullable: false,
    },
    EmpProjectReleaseDate: {
      type: "date",
      nullable: false,
    },
    IsClosed: {
      type: "bit",
      nullable: false,
    },
  },
});

export default ProjectAssignment;
