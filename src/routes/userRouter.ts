import { Router } from 'express';
import { UserController } from '../controllers/userController.ts';
import { requireAuth, requireRoles } from '../middleware/auth.ts';
import { validateBody } from '../middleware/validate.ts';
import { createUserSchema } from '../validators/schemas.ts';

const userRouter = Router();
const userController = new UserController();

userRouter.get('/', requireAuth, requireRoles('admin'), (req, res) => {
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.responses[200] = { description: 'Daftar user' }
  return userController.getUsers(req, res);
});

userRouter.post('/', requireAuth, requireRoles('admin'), validateBody(createUserSchema), (req, res) => {
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { name: 'Budi', email: 'budi@mail.com', password: 'rahasia123', role: 'customer' } }
  // #swagger.responses[201] = { description: 'User dibuat' }
  return userController.createUser(req, res);
});

export { userRouter };