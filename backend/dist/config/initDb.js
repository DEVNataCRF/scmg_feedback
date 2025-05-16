"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const database_1 = require("./database");
const User_1 = require("../models/User");
async function initDb() {
    try {
        await database_1.AppDataSource.initialize();
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const adminExists = await userRepository.findOne({
            where: { email: 'admin@scmg.com.br' },
        });
        if (!adminExists) {
            const admin = userRepository.create({
                name: 'Administrador',
                email: 'admin@scmg.com.br',
                password: 'admin123',
                isAdmin: true,
            });
            await admin.hashPassword();
            await userRepository.save(admin);
        }
        await database_1.AppDataSource.destroy();
    }
    catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
    }
}
initDb();
