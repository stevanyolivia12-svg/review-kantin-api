import type { Request, Response } from 'express';
import { FlagService } from '../services/flagService.ts';
import { respondWithError } from '../middleware/errorHandler.ts';

export class FlagController {
  private flagService: FlagService;

  constructor(flagService: FlagService = new FlagService()) {
    this.flagService = flagService;
  }

  private handleError(res: Response, error: unknown): Response {
    return respondWithError(res, error);
  }

  getFlags = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { status } = res.locals.validatedQuery as { status?: string };
      const data = await this.flagService.getAllFlags(status);
      return res.status(200).json({ status: 'success', data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  updateFlagStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.flagService.updateFlagStatus(Number(req.params.id), req.body.status);
      return res.status(200).json({ status: 'success', data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}
