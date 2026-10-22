import type { Request, Response } from 'express';
import { StallService } from '../services/stallService.ts';
import { respondWithError } from '../middleware/errorHandler.ts';

export class StallController {
  private stallService: StallService;

  constructor(stallService: StallService = new StallService()) {
    this.stallService = stallService;
  }

  private handleError(res: Response, error: unknown): Response {
    return respondWithError(res, error);
  }

  getStalls = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { page, limit, search, category } = res.locals.validatedQuery as {
        page: number;
        limit: number;
        search?: string;
        category?: string;
      };

      const { data, total } = await this.stallService.getAllStalls({
        search,
        category,
        page,
        limit,
      });

      return res.status(200).json({ status: 'success', meta: { page, limit, total }, data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  getStallById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const stall = await this.stallService.getStallById(Number(req.params.id));
      return res.status(200).json({ status: 'success', data: stall });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  getStallMenus = async (req: Request, res: Response): Promise<Response> => {
    try {
      const menus = await this.stallService.getStallMenus(Number(req.params.id));
      return res.status(200).json({ status: 'success', data: menus });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  createStall = async (req: Request, res: Response): Promise<Response> => {
    try {
      const stall = await this.stallService.createStall(req.body, req.auth!);
      return res.status(201).json({ status: 'success', data: stall });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  updateStall = async (req: Request, res: Response): Promise<Response> => {
    try {
      const stall = await this.stallService.updateStall(Number(req.params.id), req.body, req.auth!);
      return res.status(200).json({ status: 'success', data: stall });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  deleteStall = async (req: Request, res: Response): Promise<Response> => {
    try {
      const stall = await this.stallService.deleteStall(Number(req.params.id), req.auth!);
      return res.status(200).json({ status: 'success', data: stall });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}
