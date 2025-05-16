"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: __dirname + '/../.env' });
console.log('DB_HOST:', process.env.DB_HOST);
const database_1 = require("./config/database");
const env_1 = require("./config/env");
const app_1 = __importDefault(require("./app"));
const PORT = parseInt(env_1.env.PORT);
(async () => {
    try {
        console.log('Antes do initialize');
        await database_1.AppDataSource.initialize();
        console.log('Depois do initialize');
        app_1.default.listen(PORT, () => {
            console.log('Servidor rodando!');
        });
    }
    catch (error) {
        console.error('Erro ao inicializar:', error);
    }
})();
