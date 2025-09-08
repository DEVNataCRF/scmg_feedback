import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDepartmentsTable1750000000000 implements MigrationInterface {
    name = 'AddDepartmentsTable1750000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`CREATE TABLE "departments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_departments_name" UNIQUE ("name"), CONSTRAINT "PK_departments_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "feedbacks" ADD "department_id" uuid`);
        await queryRunner.query(`CREATE INDEX "IDX_feedback_department_id" ON "feedbacks" ("department_id")`);
        await queryRunner.query(`ALTER TABLE "feedbacks" ADD CONSTRAINT "FK_feedback_department" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`INSERT INTO departments (name) SELECT DISTINCT department FROM feedbacks WHERE department IS NOT NULL`);
        await queryRunner.query(`UPDATE feedbacks f SET department_id = d.id FROM departments d WHERE f.department = d.name`);
        await queryRunner.query(`ALTER TABLE "feedbacks" DROP COLUMN "department"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feedbacks" ADD "department" character varying`);
        await queryRunner.query(`UPDATE feedbacks f SET department = d.name FROM departments d WHERE f.department_id = d.id`);
        await queryRunner.query(`ALTER TABLE "feedbacks" DROP CONSTRAINT "FK_feedback_department"`);
        await queryRunner.query(`DROP INDEX "IDX_feedback_department_id"`);
        await queryRunner.query(`ALTER TABLE "feedbacks" DROP COLUMN "department_id"`);
        await queryRunner.query(`DROP TABLE "departments"`);
    }
}
