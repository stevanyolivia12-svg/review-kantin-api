import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { AppError } from '../errors/appError.ts';

export type UserRole = 'admin' | 'owner' | 'customer';

export interface AuthenticatedUser {
  id: number;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthenticatedUser;
    }
  }
}

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new AppError(500, 'JWT_CONFIGURATION_ERROR', 'JWT_SECRET harus diatur minimal 32 karakter.');
  }
  return secret;
}

export function createAccessToken(user: AuthenticatedUser): string {
  return jwt.sign({ email: user.email, role: user.role }, getJwtSecret(), {
    subject: String(user.id),
    expiresIn: '1h',
  });
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authorization = req.header('authorization')?.trim();
  const token = authorization?.match(/^Bearer\s+(\S+)$/i)?.[1];
  if (!token) {
    const message = authorization
      ? 'Format Authorization harus Bearer <token>.'
      : 'Token Bearer diperlukan.';
    next(new AppError(401, 'UNAUTHENTICATED', message));
    return;
  }

  try {
    const payload = jwt.verify(token, getJwtSecret()) as JwtPayload;
    const id = Number(payload.sub);
    const role = payload.role;
    if (
      !Number.isInteger(id) || id < 1 ||
      typeof payload.email !== 'string' ||
      !['admin', 'owner', 'customer'].includes(role)
    ) {
      throw new Error('Invalid JWT claims');
    }
    req.auth = { id, email: payload.email, role: role as UserRole };
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }
    next(new AppError(401, 'INVALID_TOKEN', 'Token tidak valid atau sudah kedaluwarsa.'));
  }
}

export function requireRoles(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth) {
      next(new AppError(401, 'UNAUTHENTICATED', 'Autentikasi diperlukan.'));
      return;
    }
    if (!roles.includes(req.auth.role)) {
      next(new AppError(403, 'FORBIDDEN', 'Role tidak memiliki akses ke resource ini.'));
      return;
    }
    next();
  };
}