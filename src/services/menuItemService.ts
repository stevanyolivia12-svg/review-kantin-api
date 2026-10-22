import {
  MenuItemRepository,
  type CreateMenuItemInput,
} from '../repositories/menuItemRepository.ts';
import type { MenuItemResponseDto } from '../dtos/menuItemDto.ts';
import { AppError } from '../errors/appError.ts';
import type { AuthenticatedUser } from '../middleware/auth.ts';
import { StallRepository } from '../repositories/stallRepository.ts';

type MenuItemRow = NonNullable<Awaited<ReturnType<MenuItemRepository['findById']>>>;

export class MenuItemService {
  private menuItemRepository: MenuItemRepository;

  constructor(
    menuItemRepository: MenuItemRepository = new MenuItemRepository(),
    private readonly stallRepository: StallRepository = new StallRepository(),
  ) {
    this.menuItemRepository = menuItemRepository;
  }

  private toDto(row: MenuItemRow): MenuItemResponseDto {
    return {
      id: row.id,
      stallId: row.stallId,
      name: row.name,
      price: row.price,
      isAvailable: Boolean(row.isAvailable),
    };
  }

  async getAllMenuItems(): Promise<MenuItemResponseDto[]> {
    const rows = await this.menuItemRepository.findAll();
    return rows.map((row) => this.toDto(row));
  }

  async getMenuItemById(id: number): Promise<MenuItemResponseDto> {
    const row = await this.menuItemRepository.findById(id);
    if (!row) throw new Error('MENU_ITEM_NOT_FOUND');
    return this.toDto(row);
  }

  async createMenuItem(input: CreateMenuItemInput, actor: AuthenticatedUser): Promise<MenuItemResponseDto> {
    if (!input.stallId || !input.name || input.price === undefined) {
      throw new Error('MENU_ITEM_INVALID_INPUT');
    }
    await this.assertCanManageStall(input.stallId, actor);
    const row = await this.menuItemRepository.create(input);
    if (!row) throw new Error('MENU_ITEM_NOT_FOUND');
    return this.toDto(row);
  }

  async updateMenuItem(
    id: number,
    input: Partial<CreateMenuItemInput>,
    actor: AuthenticatedUser,
  ): Promise<MenuItemResponseDto> {
    const existing = await this.menuItemRepository.findById(id);
    if (!existing) throw new Error('MENU_ITEM_NOT_FOUND');
    await this.assertCanManageStall(existing.stallId, actor);
    if (input.stallId !== undefined) await this.assertCanManageStall(input.stallId, actor);
    const row = await this.menuItemRepository.update(id, input);
    if (!row) throw new Error('MENU_ITEM_NOT_FOUND');
    return this.toDto(row);
  }

  async deleteMenuItem(id: number, actor: AuthenticatedUser): Promise<MenuItemResponseDto> {
    const existing = await this.menuItemRepository.findById(id);
    if (!existing) throw new Error('MENU_ITEM_NOT_FOUND');
    await this.assertCanManageStall(existing.stallId, actor);
    const row = await this.menuItemRepository.remove(id);
    if (!row) throw new Error('MENU_ITEM_NOT_FOUND');
    return this.toDto(row);
  }

  private async assertCanManageStall(stallId: number, actor: AuthenticatedUser): Promise<void> {
    const stall = await this.stallRepository.findById(stallId);
    if (!stall) throw new AppError(404, 'STALL_NOT_FOUND', 'Warung tidak ditemukan.');
    if (actor.role !== 'admin' && stall.ownerId !== actor.id) {
      throw new AppError(403, 'FORBIDDEN', 'Menu hanya dapat dikelola oleh pemilik warung.');
    }
  }
}