import type { Request, Response } from 'express';
import { ReviewService } from '../services/reviewService.ts';

export class ReviewController {
  private reviewService: ReviewService;

  constructor(reviewService: ReviewService = new ReviewService()) {
    this.reviewService = reviewService;
  }

  private handleError(res: Response, error: unknown): Response {
    if (error instanceof Error && error.message === 'REVIEW_NOT_FOUND') {
      return res.status(404).json({ status: 'fail', message: 'Review tidak ditemukan' });
    }
    if (error instanceof Error && error.message.startsWith('REVIEW_INVALID')) {
      return res.status(400).json({ status: 'fail', message: 'Data review tidak valid' });
    }
    if (error instanceof Error && error.message.includes('UNIQUE')) {
      return res.status(409).json({ status: 'fail', message: 'User sudah pernah review stall ini' });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error: error instanceof Error ? error.message : String(error),
    });
  }

  getReviews = async (req: Request, res: Response): Promise<Response> => {
    try {
      const stallId = req.query.stallId ? Number(req.query.stallId) : undefined;
      const data = await this.reviewService.getAllReviews(stallId);
      return res.status(200).json({ status: 'success', data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  createReview = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.reviewService.createReview(req.body);
      return res.status(201).json({ status: 'success', data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  deleteReview = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.reviewService.deleteReview(Number(req.params.id));
      return res.status(200).json({ status: 'success', data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}