import { Router } from 'express';
import { MenuItemController } from '../controllers/menuItemController.ts';

const menuItemRouter = Router();
const menuItemController = new MenuItemController();

menuItemRouter.get('/', (req, res) => menuItemController.getMenuItems(req, res));
menuItemRouter.post('/', (req, res) => menuItemController.createMenuItem(req, res));
menuItemRouter.get('/:id', (req, res) => menuItemController.getMenuItemById(req, res));
menuItemRouter.put('/:id', (req, res) => menuItemController.updateMenuItem(req, res));
menuItemRouter.delete('/:id', (req, res) => menuItemController.deleteMenuItem(req, res));

export { menuItemRouter };