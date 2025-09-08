import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { env } from '../config/env';

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookieHeader = req.headers.cookie;
  const token = cookieHeader
    ?.split(';')
    .map(c => c.trim())
    .find(c => c.startsWith('token='))
    ?.split('=')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const data = jwt.verify(token, env.JWT_SECRET);
    const { id } = data as TokenPayload;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  return next();
}; 