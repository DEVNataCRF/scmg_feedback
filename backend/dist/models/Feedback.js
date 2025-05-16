"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feedback = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let Feedback = class Feedback {
};
exports.Feedback = Feedback;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Feedback.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Feedback.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: process.env.NODE_ENV === 'test' ? 'text' : 'enum',
        enum: ['Excelente', 'Bom', 'Regular', 'Ruim']
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Feedback.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], Feedback.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", User_1.User)
], Feedback.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Feedback.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], Feedback.prototype, "suggestion", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'int' }),
    __metadata("design:type", Number)
], Feedback.prototype, "recomendacao", void 0);
exports.Feedback = Feedback = __decorate([
    (0, typeorm_1.Entity)('feedbacks'),
    (0, typeorm_1.Index)(['createdAt', 'department']),
    (0, typeorm_1.Index)(['rating', 'createdAt'])
], Feedback);
