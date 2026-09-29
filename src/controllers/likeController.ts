import type { Request, Response } from 'express';
import { LikeService } from '../services/likeService.ts';

export class LikeController {
  private likeService: LikeService;

  constructor(likeService: LikeService = new LikeService()) {
    this.likeService = likeService;
  }

  private handleError(res: Response, error: unknown): Response {
    if (error instanceof Error && error.message === 'LIKE_NOT_FOUND') {
      return res.status(404).json({ status: 'fail', message: 'Like tidak ditemukan' });
    }
    if (error instanceof Error && error.message === 'LIKE_ALREADY_EXISTS') {
      return res.status(409).json({ status: 'fail', message: 'User sudah like review ini' });
    }
    if (error instanceof Error && error.message === 'LIKE_INVALID_INPUT') {
      return res.status(400).json({ status: 'fail', message: 'Data like tidak valid' });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error: error instanceof Error ? error.message : String(error),
    });
  }

  createLike = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.likeService.createLike(req.body);
      return res.status(201).json({ status: 'success', data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  deleteLike = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.likeService.deleteLike(Number(req.params.id));
      return res.status(200).json({ status: 'success', data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}