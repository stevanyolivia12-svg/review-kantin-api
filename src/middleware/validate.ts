import type { NextFunction, Request, Response } from 'express';
import { z, type ZodType } from 'zod';
import { AppError } from '../errors/appError.ts';

export function validateBody(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(new AppError(
        400,
        'VALIDATION_ERROR',
        'Validasi gagal',
        result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      ));
      return;
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      next(new AppError(
        400,
        'VALIDATION_ERROR',
        'Validasi gagal',
        result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      ));
      return;
    }
    res.locals.validatedQuery = result.data;
    next();
  };
}

export function validateIdParam(req: Request, _res: Response, next: NextFunction): void {
  const id = req.params.id;
  const result = z.string().regex(/^[1-9]\d*$/).safeParse(id);
  if (!result.success) {
    next(new AppError(400, 'VALIDATION_ERROR', 'Validasi gagal', [{
      field: 'id',
      message: 'id harus berupa bilangan bulat positif',
    }]));
    return;
  }
  next();
}