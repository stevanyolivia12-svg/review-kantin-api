import { Router } from 'express';
import { FlagController } from '../controllers/flagController.ts';
import { requireAuth, requireRoles } from '../middleware/auth.ts';
import { validateBody, validateIdParam, validateQuery } from '../middleware/validate.ts';
import { flagListQuerySchema, updateFlagSchema } from '../validators/schemas.ts';

const flagRouter = Router();
const flagController = new FlagController();

flagRouter.get('/', requireAuth, requireRoles('admin'), validateQuery(flagListQuerySchema), (req, res) => {
	// #swagger.security = [{ "bearerAuth": [] }]
	return flagController.getFlags(req, res);
});
flagRouter.put('/:id', requireAuth, requireRoles('admin'), validateIdParam, validateBody(updateFlagSchema), (req, res) => {
	// #swagger.security = [{ "bearerAuth": [] }]
	return flagController.updateFlagStatus(req, res);
});

export { flagRouter };