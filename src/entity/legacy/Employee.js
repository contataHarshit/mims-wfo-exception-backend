// src/entity/Employee.js
import { EntitySchema } from "typeorm";

const Employee = new EntitySchema({
  name: "Employee",
  tableName: "Employees",
  columns: {
    EmployeeId: {
      primary: true,
      type: "int",
      generated: true,
    },
    EmployeeNumber: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    EmployeeTypeId: {
      type: "bigint",
      nullable: true,
    },
    FirstName: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    MiddleName: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    LastName: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    WindowsName: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    Gender: {
      type: "varchar",
      length: 20,
      nullable: true,
    },
    JoiningDesignationId: {
      type: "bigint",
      nullable: true,
    },
    HRRepId: {
      type: "bigint",
      nullable: true,
    },
    ReleventWorkExperience: {
      type: "decimal",
      precision: 5,
      scale: 2,
      nullable: true,
    },
    TotalWorkExperience: {
      type: "decimal",
      precision: 5,
      scale: 2,
      nullable: true,
    },
    MentorId: {
      type: "bigint",
      nullable: true,
    },
    Email: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    Status: {
      type: "varchar",
      length: 20,
      nullable: true,
    },
    IsMentor: {
      type: "bit",
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
    DateOfJoining: {
      type: "datetime",
      nullable: true,
    },
    DateOfBirth: {
      type: "datetime",
      nullable: true,
    },
    AnniversaryDate: {
      type: "datetime",
      nullable: true,
    },
    PermanentAddressLine1: {
      type: "varchar",
      length: 200,
      nullable: true,
    },
    PermanentAddressState: {
      type: "varchar",
      length: 30,
      nullable: true,
    },
    PermanentAddressContactNo: {
      type: "varchar",
      length: 200,
      nullable: true,
    },
    ProbationCompleteDate: {
      type: "datetime",
      nullable: true,
    },
    UserName: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    CurrentDesignationId: {
      type: "bigint",
      nullable: true,
    },
    EmployeeStatusId: {
      type: "bigint",
      nullable: true,
    },
    Notes: {
      type: "nchar",
      length: 2112,
      nullable: true,
    },
    CurrentAddressLine1: {
      type: "varchar",
      length: 200,
      nullable: true,
    },
    CurrentAddressState: {
      type: "varchar",
      length: 30,
      nullable: true,
    },
    CurrentAddressContactNo: {
      type: "varchar",
      length: 20,
      nullable: true,
    },
    MobileNo: {
      type: "varchar",
      length: 20,
      nullable: true,
    },
    ELTaken: {
      type: "decimal",
      precision: 18,
      scale: 1,
      nullable: true,
    },
    CLTaken: {
      type: "decimal",
      precision: 18,
      scale: 1,
      nullable: true,
    },
    RHTaken: {
      type: "decimal",
      precision: 18,
      scale: 1,
      nullable: true,
    },
    CarryForwardLeaveBalance: {
      type: "decimal",
      precision: 18,
      scale: 1,
      nullable: true,
    },
    ManagerId: {
      type: "bigint",
      nullable: true,
    },
    CurrentAddressLine2: {
      type: "varchar",
      length: 200,
      nullable: true,
    },
    CurrentCity: {
      type: "varchar",
      length: 30,
      nullable: true,
    },
    CurrentZip: {
      type: "varchar",
      length: 20,
      nullable: true,
    },
    PermanentAddressLine2: {
      type: "varchar",
      length: 200,
      nullable: true,
    },
    PermanentCity: {
      type: "varchar",
      length: 30,
      nullable: true,
    },
    PermanentZip: {
      type: "varchar",
      length: 20,
      nullable: true,
    },
    RelievingDate: {
      type: "datetime",
      nullable: true,
    },
    LineManagerId: {
      type: "bigint",
      nullable: true,
    },
    AnnualCycle: {
      type: "int",
      nullable: true,
    },
    MidTermCycle: {
      type: "int",
      nullable: true,
    },
    LeaveEncashed: {
      type: "decimal",
      precision: 18,
      scale: 1,
      nullable: true,
    },
    EncashedDate: {
      type: "datetime",
      nullable: true,
    },
    empImageName: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    LeaveApprovingAuthorityId: {
      type: "bigint",
      nullable: true,
    },
    CurrentContactNo2: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    CurrentContactNo3: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    PermanentContactNo2: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    PermanentContactNo3: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    PassportNo: {
      type: "varchar",
      length: 15,
      nullable: true,
    },
    IssueDate: {
      type: "date",
      nullable: true,
    },
    ExpiryDate: {
      type: "date",
      nullable: true,
    },
    EmployeeDivisionId: {
      type: "bigint",
      nullable: true,
    },
    EmployeeLocationId: {
      type: "bigint",
      nullable: true,
    },
    CurrentProbationDate: {
      type: "datetime",
      nullable: true,
    },
    ConfirmedProbationDate: {
      type: "datetime",
      nullable: true,
    },
  },
});

export default Employee;
