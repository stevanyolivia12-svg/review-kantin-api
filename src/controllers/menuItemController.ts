import type { Request, Response } from 'express';
import { MenuItemService } from '../services/menuItemService.ts';
import { respondWithError } from '../middleware/errorHandler.ts';

export class MenuItemController {
  private menuItemService: MenuItemService;

  constructor(menuItemService: MenuItemService = new MenuItemService()) {
    this.menuItemService = menuItemService;
  }

  private handleError(res: Response, error: unknown): Response {
    return respondWithError(res, error);
  }

  getMenuItems = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.menuItemService.getAllMenuItems();
      return res.status(200).json({ status: 'success', data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  getMenuItemById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.menuItemService.getMenuItemById(Number(req.params.id));
      return res.status(200).json({ status: 'success', data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  createMenuItem = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.menuItemService.createMenuItem(req.body, req.auth!);
      return res.status(201).json({ status: 'success', data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  updateMenuItem = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.menuItemService.updateMenuItem(Number(req.params.id), req.body, req.auth!);
      return res.status(200).json({ status: 'success', data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  deleteMenuItem = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.menuItemService.deleteMenuItem(Number(req.params.id), req.auth!);
      return res.status(200).json({ status: 'success', data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}