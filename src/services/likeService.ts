import { LikeRepository, type CreateLikeInput } from '../repositories/likeRepository.ts';
import { AppError } from '../errors/appError.ts';
import type { AuthenticatedUser } from '../middleware/auth.ts';

export class LikeService {
  private likeRepository: LikeRepository;

  constructor(likeRepository: LikeRepository = new LikeRepository()) {
    this.likeRepository = likeRepository;
  }

  async createLike(input: Omit<CreateLikeInput, 'userId'>, actor: AuthenticatedUser) {
    if (!input.reviewId) throw new Error('LIKE_INVALID_INPUT');
    const existing = await this.likeRepository.findExisting(input.reviewId, actor.id);
    if (existing) throw new Error('LIKE_ALREADY_EXISTS');

    const row = await this.likeRepository.create({ ...input, userId: actor.id });
    if (!row) throw new Error('LIKE_NOT_FOUND');
    await this.likeRepository.recalcReviewLikeCount(input.reviewId);
    return row;
  }

  async deleteLike(id: number, actor: AuthenticatedUser) {
    const existing = await this.likeRepository.findById(id);
    if (!existing) throw new Error('LIKE_NOT_FOUND');
    if (actor.role !== 'admin' && existing.userId !== actor.id) {
      throw new AppError(403, 'FORBIDDEN', 'Like hanya dapat dihapus oleh pembuatnya.');
    }
    const row = await this.likeRepository.remove(id);
    if (!row) throw new Error('LIKE_NOT_FOUND');
    await this.likeRepository.recalcReviewLikeCount(existing.reviewId);
    return row;
  }
}