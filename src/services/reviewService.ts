import { ReviewRepository, type CreateReviewInput } from '../repositories/reviewRepository.ts';
import type { ReviewResponseDto } from '../dtos/ReviewResponeDto.ts';
import { AppError } from '../errors/appError.ts';
import type { AuthenticatedUser } from '../middleware/auth.ts';

export class ReviewService {
  private reviewRepository: ReviewRepository;

  constructor(reviewRepository: ReviewRepository = new ReviewRepository()) {
    this.reviewRepository = reviewRepository;
  }

  private toDto(row: any): ReviewResponseDto {
    return {
      id: row.id,
      stallId: row.stallId,
      userId: row.userId,
      rating: row.rating,
      comment: row.comment,
      likeCount: row.likeCount,
      createdAt: row.createdAt,
      user: row.userName ? { id: row.userId, name: row.userName } : null,
    };
  }

  async getAllReviews(stallId?: number): Promise<ReviewResponseDto[]> {
    const rows = await this.reviewRepository.findAll(stallId);
    return rows.map((row) => this.toDto(row));
  }

  async createReview(input: Omit<CreateReviewInput, 'userId'>, actor: AuthenticatedUser): Promise<ReviewResponseDto> {
    if (!input.stallId || input.rating === undefined) {
      throw new Error('REVIEW_INVALID_INPUT');
    }
    if (input.rating < 1 || input.rating > 5) {
      throw new Error('REVIEW_INVALID_RATING');
    }
    const row = await this.reviewRepository.create({ ...input, userId: actor.id });
    if (!row) throw new Error('REVIEW_NOT_FOUND');
    await this.reviewRepository.recalcStallRating(input.stallId);
    return this.toDto(row);
  }

  async deleteReview(id: number, actor: AuthenticatedUser): Promise<ReviewResponseDto> {
    const existing = await this.reviewRepository.findById(id);
    if (!existing) throw new Error('REVIEW_NOT_FOUND');
    if (actor.role !== 'admin' && existing.userId !== actor.id) {
      throw new AppError(403, 'FORBIDDEN', 'Review hanya dapat dihapus oleh pembuatnya.');
    }
    const row = await this.reviewRepository.remove(id);
    if (!row) throw new Error('REVIEW_NOT_FOUND');
    await this.reviewRepository.recalcStallRating(existing.stallId);
    return this.toDto(row);
  }
}