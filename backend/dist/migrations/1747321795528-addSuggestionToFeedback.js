"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSuggestionToFeedback1747321795528 = void 0;
class AddSuggestionToFeedback1747321795528 {
    constructor() {
        this.name = 'AddSuggestionToFeedback1747321795528';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "feedbacks" ADD "suggestion" text`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "feedbacks" DROP COLUMN "suggestion"`);
    }
}
exports.AddSuggestionToFeedback1747321795528 = AddSuggestionToFeedback1747321795528;
