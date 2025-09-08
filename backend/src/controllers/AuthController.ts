import { Request, Response } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { env } from '../config/env';
import logger from '../config/logger';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const userRepository = AppDataSource.getRepository(User);

      const userExists = await userRepository.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      const user = userRepository.create({ name, email, password });
      await user.hashPassword();
      await userRepository.save(user);

      const signOptions: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as any || '1d' };
      const token = jwt.sign({ id: user.id }, env.JWT_SECRET as Secret, signOptions);

      return res.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
        token,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { email } });
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      if (!user) {
        logger.info('Tentativa de login falhou', { email, ip, resultado: 'Usuário não encontrado' });
        return res.status(400).json({ error: 'Usuário não encontrado' });
      }
      const isValidPassword = await user.checkPassword(password);
      if (!isValidPassword) {
        logger.info('Tentativa de login falhou', { email, ip, resultado: 'Senha inválida' });
        return res.status(400).json({ error: 'Senha inválida' });
      }
      logger.info('Login realizado com sucesso', { email, ip, resultado: 'Sucesso', isAdmin: user.isAdmin });
      const signOptions: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as any || '1d' };
      const token = jwt.sign({ id: user.id }, env.JWT_SECRET as Secret, signOptions);
      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
        token,
      });
    } catch (error) {
      console.log(error); // DEBUG: mostrar erro real nos testes
      logger.error('Erro interno ao tentar login', { email: req.body?.email, error });
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const { email, senhaAtual, novaSenha } = req.body;
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: 'Usuário não encontrado' });
      }
      if (req.user.isAdmin) {
        user.password = novaSenha;
        await user.hashPassword();
        user.passwordChangeCount = (user.passwordChangeCount || 0) + 1;
        await userRepository.save(user);
        return res.json({ message: 'Senha alterada com sucesso (admin).' });
      }
      if (req.user.id !== user.id) {
        return res.status(403).json({ error: 'Acesso negado.' });
      }
      if ((user.passwordChangeCount || 0) >= 1) {
        return res.status(403).json({ error: 'Apenas administradores podem alterar a senha novamente.' });
      }
      const isValidPassword = await user.checkPassword(senhaAtual);
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Senha atual inválida.' });
      }
      user.password = novaSenha;
      await user.hashPassword();
      user.passwordChangeCount = (user.passwordChangeCount || 0) + 1;
      await userRepository.save(user);
      return res.json({ message: 'Senha alterada com sucesso.' });
    } catch (error) {
      logger.error('Erro interno ao tentar alterar senha', { email: req.body?.email, error });
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}