import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { reviews, users, stalls } from '../db/schema.ts';

export interface CreateReviewInput {
  stallId: number;
  userId: number;
  rating: number;
  comment?: string | null;
}

export class ReviewRepository {
  async findAll(stallId?: number) {
    const db = await getDb();
    const query = db
      .select({
        id: reviews.id,
        stallId: reviews.stallId,
        userId: reviews.userId,
        rating: reviews.rating,
        comment: reviews.comment,
        likeCount: reviews.likeCount,
        createdAt: reviews.createdAt,
        userName: users.name,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .orderBy(reviews.id);

    if (stallId) {
      return query.where(eq(reviews.stallId, stallId));
    }
    return query;
  }

  async findById(id: number) {
    const db = await getDb();
    const rows = await db.select().from(reviews).where(eq(reviews.id, id));
    return rows[0];
  }

  async create(input: CreateReviewInput) {
    const db = await getDb();
    const rows = await db
      .insert(reviews)
      .output()
      .values({
        stallId: input.stallId,
        userId: input.userId,
        rating: input.rating,
        comment: input.comment ?? null,
        likeCount: 0,
      });
    return rows[0];
  }

  async remove(id: number) {
    const db = await getDb();
    const rows = await db.delete(reviews).where(eq(reviews.id, id)).output();
    return rows[0];
  }

  // Hitung ulang avg_rating dan review_count di STALLS setelah create/delete review.
  async recalcStallRating(stallId: number) {
    const db = await getDb();
    const rows = await db
      .select({ rating: reviews.rating })
      .from(reviews)
      .where(eq(reviews.stallId, stallId));

    const total = rows.length;
    const avg = total > 0 ? rows.reduce((sum, r) => sum + r.rating, 0) / total : 0;

    await db
      .update(stalls)
      .set({ reviewCount: total, avgRating: avg.toFixed(2) })
      .where(eq(stalls.id, stallId));
  }
}