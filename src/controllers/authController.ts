import type { Request, Response } from 'express';
import { AuthService } from '../services/authService.ts';

export class AuthController {
  constructor(private readonly authService: AuthService = new AuthService()) {}

  register = async (req: Request, res: Response): Promise<Response> => {
    const data = await this.authService.register(req.body);
    return res.status(201).json({ status: 'success', data });
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    const data = await this.authService.login(req.body);
    return res.status(200).json({ status: 'success', data });
  };

  me = async (req: Request, res: Response): Promise<Response> => {
    const user = await this.authService.getCurrentUser(req.auth!.id);
    return res.status(200).json({ status: 'success', data: user });
  };
}