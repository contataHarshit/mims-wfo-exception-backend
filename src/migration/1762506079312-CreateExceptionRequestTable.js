/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export class CreateExceptionRequestTable1762506079312 {
    name = 'CreateExceptionRequestTable1762506079312'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "Designation" ("DesignationId" bigint NOT NULL, "Name" varchar(100) NOT NULL, "Description" varchar(255), "IsActive" bit, "CreatedBy" varchar(50), "CreatedOn" datetime, "ModifiedBy" varchar(50), "ModifiedOn" datetime, CONSTRAINT "PK_03bdaba45735ef8c4490c4fdfd2" PRIMARY KEY ("DesignationId"))`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" DROP CONSTRAINT "FK_15635a75fb410aeefb880a05bda"`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" DROP CONSTRAINT "FK_2e6e271a606543d186cfb697926"`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" DROP CONSTRAINT "FK_80a62bfeba2eb03c86bc4dda9b9"`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" DROP COLUMN "employeeEmployeeId"`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" ADD "employeeEmployeeId" bigint`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" DROP COLUMN "managerId"`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" ADD "managerId" bigint`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" DROP COLUMN "updatedById"`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" ADD "updatedById" bigint`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" ADD CONSTRAINT "FK_15635a75fb410aeefb880a05bda" FOREIGN KEY ("employeeEmployeeId") REFERENCES "Employee"("EmployeeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" ADD CONSTRAINT "FK_2e6e271a606543d186cfb697926" FOREIGN KEY ("managerId") REFERENCES "Employee"("EmployeeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" ADD CONSTRAINT "FK_80a62bfeba2eb03c86bc4dda9b9" FOREIGN KEY ("updatedById") REFERENCES "Employee"("EmployeeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" DROP CONSTRAINT "FK_80a62bfeba2eb03c86bc4dda9b9"`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" DROP CONSTRAINT "FK_2e6e271a606543d186cfb697926"`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" DROP CONSTRAINT "FK_15635a75fb410aeefb880a05bda"`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" DROP COLUMN "updatedById"`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" ADD "updatedById" int`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" DROP COLUMN "managerId"`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" ADD "managerId" int`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" DROP COLUMN "employeeEmployeeId"`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" ADD "employeeEmployeeId" int`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" ADD CONSTRAINT "FK_80a62bfeba2eb03c86bc4dda9b9" FOREIGN KEY ("updatedById") REFERENCES "Employee"("EmployeeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" ADD CONSTRAINT "FK_2e6e271a606543d186cfb697926" FOREIGN KEY ("managerId") REFERENCES "Employee"("EmployeeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" ADD CONSTRAINT "FK_15635a75fb410aeefb880a05bda" FOREIGN KEY ("employeeEmployeeId") REFERENCES "Employee"("EmployeeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "Designation"`);
    }
}
