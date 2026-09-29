import { LikeRepository, type CreateLikeInput } from '../repositories/likeRepository.ts';

export class LikeService {
  private likeRepository: LikeRepository;

  constructor(likeRepository: LikeRepository = new LikeRepository()) {
    this.likeRepository = likeRepository;
  }

  async createLike(input: CreateLikeInput) {
    if (!input.reviewId || !input.userId) throw new Error('LIKE_INVALID_INPUT');
    const existing = await this.likeRepository.findExisting(input.reviewId, input.userId);
    if (existing) throw new Error('LIKE_ALREADY_EXISTS');

    const row = await this.likeRepository.create(input);
    if (!row) throw new Error('LIKE_NOT_FOUND');
    await this.likeRepository.recalcReviewLikeCount(input.reviewId);
    return row;
  }

  async deleteLike(id: number) {
    const existing = await this.likeRepository.findById(id);
    if (!existing) throw new Error('LIKE_NOT_FOUND');
    const row = await this.likeRepository.remove(id);
    if (!row) throw new Error('LIKE_NOT_FOUND');
    await this.likeRepository.recalcReviewLikeCount(existing.reviewId);
    return row;
  }
}