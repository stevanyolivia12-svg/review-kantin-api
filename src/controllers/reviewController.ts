import type { Request, Response } from 'express';
import { ReviewService } from '../services/reviewService.ts';
import { respondWithError } from '../middleware/errorHandler.ts';

export class ReviewController {
  private reviewService: ReviewService;

  constructor(reviewService: ReviewService = new ReviewService()) {
    this.reviewService = reviewService;
  }

  private handleError(res: Response, error: unknown): Response {
    return respondWithError(res, error);
  }

  getReviews = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { stallId } = res.locals.validatedQuery as { stallId?: number };
      const data = await this.reviewService.getAllReviews(stallId);
      return res.status(200).json({ status: 'success', data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  createReview = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.reviewService.createReview(req.body, req.auth!);
      return res.status(201).json({ status: 'success', data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  deleteReview = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.reviewService.deleteReview(Number(req.params.id), req.auth!);
      return res.status(200).json({ status: 'success', data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}