/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export class Migration1762842064500 {
    name = 'Migration1762842064500'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "ExceptionRequests" ("id" int NOT NULL IDENTITY(1,1), "submissionDate" datetime NOT NULL CONSTRAINT "DF_f9a7738418ee47e647108006b4e" DEFAULT getdate(), "updatedDate" datetime NOT NULL CONSTRAINT "DF_01cc15a2a29f626fe3e51a34452" DEFAULT getdate(), "selectedDate" date NOT NULL, "primaryReason" varchar(max) NOT NULL, "remarks" varchar(max) NOT NULL, "currentStatus" varchar(50) NOT NULL CONSTRAINT "DF_df7fa2b3f106f546f50a984b5f0" DEFAULT 'PENDING', "updatedByRole" varchar(100), "approvedBy" varchar(max), "approvedRemarks" varchar(max), "rejectedBy" varchar(max), "rejectedRemarks" varchar(max), "EmployeeId" bigint, "ManagerId" bigint, "UpdatedById" bigint, CONSTRAINT "PK_ec883ba373d1c50e4234d89318a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" ADD CONSTRAINT "FK_ab37862665be2e918cd7eeec3ba" FOREIGN KEY ("EmployeeId") REFERENCES "Employee"("EmployeeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" ADD CONSTRAINT "FK_c1a1074d48c57c0a8f61a3d3861" FOREIGN KEY ("ManagerId") REFERENCES "Employee"("EmployeeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" ADD CONSTRAINT "FK_452d430741ffddb13164fbf13ee" FOREIGN KEY ("UpdatedById") REFERENCES "Employee"("EmployeeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" DROP CONSTRAINT "FK_452d430741ffddb13164fbf13ee"`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" DROP CONSTRAINT "FK_c1a1074d48c57c0a8f61a3d3861"`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" DROP CONSTRAINT "FK_ab37862665be2e918cd7eeec3ba"`);
        await queryRunner.query(`DROP TABLE "ExceptionRequests"`);
    }
}
