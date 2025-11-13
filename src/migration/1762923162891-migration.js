/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export class Migration1762923162891 {
    name = 'Migration1762923162891'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" DROP COLUMN "approvedRemarks"`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" DROP COLUMN "rejectedRemarks"`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" ADD "reviewRemarks" varchar(max)`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" DROP COLUMN "reviewRemarks"`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" ADD "rejectedRemarks" varchar(MAX)`);
        await queryRunner.query(`ALTER TABLE "ExceptionRequests" ADD "approvedRemarks" varchar(MAX)`);
    }
}
