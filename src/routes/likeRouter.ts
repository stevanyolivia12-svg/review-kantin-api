import { Router } from 'express';
import { LikeController } from '../controllers/likeController.ts';
import { requireAuth, requireRoles } from '../middleware/auth.ts';
import { validateBody, validateIdParam } from '../middleware/validate.ts';
import { createLikeSchema } from '../validators/schemas.ts';

const likeRouter = Router();
const likeController = new LikeController();

likeRouter.post('/', requireAuth, requireRoles('customer'), validateBody(createLikeSchema), (req, res) => {
  // #swagger.security = [{ "bearerAuth": [] }]
  /*  #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: { reviewId: 1 }
  } */
  return likeController.createLike(req, res);
});

likeRouter.delete('/:id', requireAuth, requireRoles('admin', 'customer'), validateIdParam, (req, res) => {
  // #swagger.security = [{ "bearerAuth": [] }]
  return likeController.deleteLike(req, res);
});

export { likeRouter };