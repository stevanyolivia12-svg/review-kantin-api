import { ReviewRepository, type CreateReviewInput } from '../repositories/reviewRepository.ts';
import type { ReviewResponseDto } from '../dtos/ReviewResponeDto.ts';

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

  async createReview(input: CreateReviewInput): Promise<ReviewResponseDto> {
    if (!input.stallId || !input.userId || input.rating === undefined) {
      throw new Error('REVIEW_INVALID_INPUT');
    }
    if (input.rating < 1 || input.rating > 5) {
      throw new Error('REVIEW_INVALID_RATING');
    }
    const row = await this.reviewRepository.create(input);
    if (!row) throw new Error('REVIEW_NOT_FOUND');
    await this.reviewRepository.recalcStallRating(input.stallId);
    return this.toDto(row);
  }

  async deleteReview(id: number): Promise<ReviewResponseDto> {
    const existing = await this.reviewRepository.findById(id);
    if (!existing) throw new Error('REVIEW_NOT_FOUND');
    const row = await this.reviewRepository.remove(id);
    if (!row) throw new Error('REVIEW_NOT_FOUND');
    await this.reviewRepository.recalcStallRating(existing.stallId);
    return this.toDto(row);
  }
}