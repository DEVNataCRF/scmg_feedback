import 'dotenv/config';
import { AppDataSource } from './database';
import { User } from '../models/User';

async function initDb() {
  try {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();

    const userRepository = AppDataSource.getRepository(User);

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

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  }
}

initDb();
