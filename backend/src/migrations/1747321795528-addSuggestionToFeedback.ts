import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSuggestionToFeedback1747321795528 implements MigrationInterface {
    name = 'AddSuggestionToFeedback1747321795528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feedbacks" ADD "suggestion" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feedbacks" DROP COLUMN "suggestion"`);
    }

}
