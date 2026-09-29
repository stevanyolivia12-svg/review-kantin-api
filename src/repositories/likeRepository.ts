import { eq, and } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { likes, reviews } from '../db/schema.ts';

export interface CreateLikeInput {
  reviewId: number;
  userId: number;
}

export class LikeRepository {
  async findById(id: number) {
    const db = await getDb();
    const rows = await db.select().from(likes).where(eq(likes.id, id));
    return rows[0];
  }

  async findExisting(reviewId: number, userId: number) {
    const db = await getDb();
    const rows = await db
      .select()
      .from(likes)
      .where(and(eq(likes.reviewId, reviewId), eq(likes.userId, userId)));
    return rows[0];
  }

  async create(input: CreateLikeInput) {
    const db = await getDb();
    const rows = await db.insert(likes).output().values(input);
    return rows[0];
  }

  async remove(id: number) {
    const db = await getDb();
    const rows = await db.delete(likes).where(eq(likes.id, id)).output();
    return rows[0];
  }

  async recalcReviewLikeCount(reviewId: number) {
    const db = await getDb();
    const rows = await db.select().from(likes).where(eq(likes.reviewId, reviewId));
    await db.update(reviews).set({ likeCount: rows.length }).where(eq(reviews.id, reviewId));
  }
}