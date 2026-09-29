import type { Request, Response } from 'express';
import { UserService } from '../services/userService.ts';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService = new UserService()) {
    this.userService = userService;
  }

  private handleError(res: Response, error: unknown): Response {
    if (error instanceof Error && error.message === 'USER_EMAIL_TAKEN') {
      return res.status(409).json({ status: 'fail', message: 'Email sudah terdaftar' });
    }
    if (error instanceof Error && error.message.startsWith('USER_INVALID')) {
      return res.status(400).json({ status: 'fail', message: 'Data user tidak valid' });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error: error instanceof Error ? error.message : String(error),
    });
  }

  getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.userService.getAllUsers();
      return res.status(200).json({ status: 'success', data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = await this.userService.createUser(req.body);
      return res.status(201).json({ status: 'success', data: user });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}