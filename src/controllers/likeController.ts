import type { Request, Response } from 'express';
import { LikeService } from '../services/likeService.ts';
import { respondWithError } from '../middleware/errorHandler.ts';

export class LikeController {
  private likeService: LikeService;

  constructor(likeService: LikeService = new LikeService()) {
    this.likeService = likeService;
  }

  private handleError(res: Response, error: unknown): Response {
    return respondWithError(res, error);
  }

  createLike = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.likeService.createLike(req.body, req.auth!);
      return res.status(201).json({ status: 'success', data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  deleteLike = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.likeService.deleteLike(Number(req.params.id), req.auth!);
      return res.status(200).json({ status: 'success', data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}