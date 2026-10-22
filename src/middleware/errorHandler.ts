import type { ErrorRequestHandler, RequestHandler, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/appError.ts';

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError(404, 'ROUTE_NOT_FOUND', `Route ${req.method} ${req.originalUrl} tidak ditemukan.`));
};

export function respondWithError(res: Response, error: unknown): Response {
  let statusCode = 500;
  let message = 'Terjadi kesalahan pada server.';
  let errors: unknown[] = [];

  if (error instanceof AppError) {
    ({ statusCode, message } = error);
    if (Array.isArray(error.details)) errors = error.details;
  } else if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Validasi gagal';
    errors = error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message }));
  } else if (
    error instanceof SyntaxError &&
    typeof error === 'object' &&
    'status' in error &&
    error.status === 400
  ) {
    statusCode = 400;
    message = 'Format JSON tidak valid.';
  } else if (error instanceof Error) {
    if (error.message === 'USER_EMAIL_TAKEN') {
      statusCode = 409;
      message = 'Email sudah terdaftar.';
    } else if (error.message.includes('UNIQUE')) {
      statusCode = 409;
      message = 'Data bertentangan dengan data yang sudah ada.';
    } else if (error.message.endsWith('_NOT_FOUND')) {
      statusCode = 404;
      message = 'Data tidak ditemukan.';
    } else if (error.message.includes('_INVALID_')) {
      statusCode = 400;
      message = 'Validasi gagal';
    }
  }

  return res.status(statusCode).json({
    status: 'fail',
    message,
    errors,
  });
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  respondWithError(res, error);
};