import { Router } from 'express';
import { UserController } from '../controllers/userController.ts';

const userRouter = Router();
const userController = new UserController();

userRouter.get('/', (req, res) => {
  // #swagger.responses[200] = { description: 'Daftar user' }
  return userController.getUsers(req, res);
});

userRouter.post('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { name: 'Budi', email: 'budi@mail.com', password: 'rahasia123', role: 'customer' } }
  // #swagger.responses[201] = { description: 'User dibuat' }
  return userController.createUser(req, res);
});

export { userRouter };