import type { Request, Response } from 'express';
import { UserService } from '../services/userService.ts';
import { respondWithError } from '../middleware/errorHandler.ts';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService = new UserService()) {
    this.userService = userService;
  }

  private handleError(res: Response, error: unknown): Response {
    return respondWithError(res, error);
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