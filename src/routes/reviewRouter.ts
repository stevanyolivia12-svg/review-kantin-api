import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController.ts';
import { requireAuth, requireRoles } from '../middleware/auth.ts';
import { validateBody, validateIdParam, validateQuery } from '../middleware/validate.ts';
import { createReviewSchema, reviewListQuerySchema } from '../validators/schemas.ts';

const reviewRouter = Router();
const reviewController = new ReviewController();

reviewRouter.get('/', validateQuery(reviewListQuerySchema), (req, res) => reviewController.getReviews(req, res));
reviewRouter.post('/', requireAuth, requireRoles('customer'), validateBody(createReviewSchema), (req, res) => {
	// #swagger.security = [{ "bearerAuth": [] }]
	return reviewController.createReview(req, res);
});
reviewRouter.delete('/:id', requireAuth, requireRoles('admin', 'customer'), validateIdParam, (req, res) => {
	// #swagger.security = [{ "bearerAuth": [] }]
	return reviewController.deleteReview(req, res);
});

export { reviewRouter };