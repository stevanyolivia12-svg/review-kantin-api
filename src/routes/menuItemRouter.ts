import { Router } from 'express';
import { MenuItemController } from '../controllers/menuItemController.ts';
import { requireAuth, requireRoles } from '../middleware/auth.ts';
import { validateBody, validateIdParam } from '../middleware/validate.ts';
import { createMenuItemSchema, updateMenuItemSchema } from '../validators/schemas.ts';

const menuItemRouter = Router();
const menuItemController = new MenuItemController();

menuItemRouter.get('/', (req, res) => menuItemController.getMenuItems(req, res));
menuItemRouter.post('/', (req, res) => menuItemController.createMenuItem(req, res));
menuItemRouter.post('/', requireAuth, requireRoles('admin', 'owner'), validateBody(createMenuItemSchema), (req, res) => {
	// #swagger.security = [{ "bearerAuth": [] }]
	return menuItemController.createMenuItem(req, res);
});
menuItemRouter.get('/:id', validateIdParam, (req, res) => menuItemController.getMenuItemById(req, res));
menuItemRouter.put('/:id', requireAuth, requireRoles('admin', 'owner'), validateIdParam, validateBody(updateMenuItemSchema), (req, res) => {
	// #swagger.security = [{ "bearerAuth": [] }]
	return menuItemController.updateMenuItem(req, res);
});
menuItemRouter.delete('/:id', requireAuth, requireRoles('admin', 'owner'), validateIdParam, (req, res) => {
	// #swagger.security = [{ "bearerAuth": [] }]
	return menuItemController.deleteMenuItem(req, res);
});

export { menuItemRouter };