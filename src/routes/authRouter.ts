import { Router } from 'express';
import { AuthController } from '../controllers/authController.ts';
import { requireAuth } from '../middleware/auth.ts';
import { validateBody } from '../middleware/validate.ts';
import { loginSchema, registerSchema } from '../validators/schemas.ts';

const authRouter = Router();
const authController = new AuthController();

authRouter.get('/me', requireAuth, (req, res) => {
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.responses[200] = { description: 'Profil user yang sedang login' }
  // #swagger.responses[401] = { description: 'Token tidak valid atau tidak tersedia' }
  return authController.me(req, res);
});

authRouter.post('/register', validateBody(registerSchema), (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { name: 'Budi', email: 'budi@mail.com', password: 'rahasia123' } }
  // #swagger.responses[201] = { description: 'Registrasi customer berhasil' }
  return authController.register(req, res);
});

authRouter.post('/login', validateBody(loginSchema), (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { email: 'budi@mail.com', password: 'rahasia123' } }
  // #swagger.responses[200] = { description: 'Login berhasil, mengembalikan access token' }
  // #swagger.responses[401] = { description: 'Email atau password salah' }
  return authController.login(req, res);
});

export { authRouter };