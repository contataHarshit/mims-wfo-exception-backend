import { Table, TableForeignKey } from "typeorm";

export class CreateExceptionRequestTable1670000000000 {
  name = "CreateExceptionRequestTable1670000000000";

  async up(queryRunner) {
    await queryRunner.createTable(
      new Table({
        name: "ExceptionRequests",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "submissionDate", type: "datetime", default: "GETDATE()" },
          { name: "updatedDate", type: "datetime", default: "GETDATE()" },
          { name: "selectedDate", type: "date", isNullable: false },
          { name: "primaryReason", type: "text", isNullable: false },
          { name: "remarks", type: "text", isNullable: false },
          {
            name: "currentStatus",
            type: "varchar",
            length: "50",
            default: "'PENDING'",
          },
          {
            name: "updatedByRole",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          { name: "employeeId", type: "bigint", isNullable: false },
          { name: "managerId", type: "bigint", isNullable: true },
          { name: "updatedById", type: "bigint", isNullable: true },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "ExceptionRequests",
      new TableForeignKey({
        columnNames: ["employeeId"],
        referencedTableName: "Employee",
        referencedColumnNames: ["EmployeeId"],
      })
    );

    await queryRunner.createForeignKey(
      "ExceptionRequests",
      new TableForeignKey({
        columnNames: ["managerId"],
        referencedTableName: "Employee",
        referencedColumnNames: ["EmployeeId"],
      })
    );

    await queryRunner.createForeignKey(
      "ExceptionRequests",
      new TableForeignKey({
        columnNames: ["updatedById"],
        referencedTableName: "Employee",
        referencedColumnNames: ["EmployeeId"],
      })
    );
  }

  async down(queryRunner) {
    await queryRunner.dropTable("ExceptionRequests");
  }
}
