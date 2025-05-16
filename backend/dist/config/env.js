"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default('3001'),
    DB_HOST: zod_1.z.string(),
    DB_PORT: zod_1.z.string().default('5432'),
    DB_USER: zod_1.z.string(),
    DB_PASS: zod_1.z.string(),
    DB_NAME: zod_1.z.string(),
    JWT_SECRET: zod_1.z.string(),
    JWT_EXPIRES_IN: zod_1.z.string().default('1d'),
    NODE_ENV: zod_1.z.string().default('development'),
});
const _env = envSchema.safeParse(process.env);
if (!_env.success) {
    console.error('❌ Erro na validação das variáveis de ambiente:', _env.error.format());
    process.exit(1);
}
exports.env = _env.data;
