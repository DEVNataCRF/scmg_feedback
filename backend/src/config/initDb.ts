import 'dotenv/config';
import { AppDataSource } from './database';
import { User } from '../models/User';

async function initDb() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error('ADMIN_EMAIL e ADMIN_PASSWORD devem estar definidos.');
    }

    await AppDataSource.initialize();
    await AppDataSource.runMigrations();

    const userRepository = AppDataSource.getRepository(User);

    const adminExists = await userRepository.findOne({
      where: { email: adminEmail },
    });

    if (!adminExists) {
      const admin = userRepository.create({
        name: 'Administrador',
        email: adminEmail,
        password: adminPassword,
        isAdmin: true,
      });

      await admin.hashPassword();
      await userRepository.save(admin);
    }

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  }
}

initDb();
