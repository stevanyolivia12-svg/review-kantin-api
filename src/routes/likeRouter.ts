import { Router } from 'express';
import { LikeController } from '../controllers/likeController.ts';

const likeRouter = Router();
const likeController = new LikeController();

likeRouter.post('/', (req, res) => {
  /*  #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: { userId: 1, reviewId: 1 }
  } */
  return likeController.createLike(req, res);
});

likeRouter.delete('/:id', (req, res) => likeController.deleteLike(req, res));

export { likeRouter };