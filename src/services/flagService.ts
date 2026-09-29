import { FlagRepository } from '../repositories/flagRepository.ts';

const VALID_STATUSES = ['pending', 'resolved', 'dismissed'];

export class FlagService {
  private flagRepository: FlagRepository;

  constructor(flagRepository: FlagRepository = new FlagRepository()) {
    this.flagRepository = flagRepository;
  }

  async getAllFlags(status?: string) {
    if (status && !VALID_STATUSES.includes(status)) throw new Error('FLAG_INVALID_STATUS');
    return this.flagRepository.findAll(status);
  }

  async updateFlagStatus(id: number, status: string) {
    if (!VALID_STATUSES.includes(status)) throw new Error('FLAG_INVALID_STATUS');
    const row = await this.flagRepository.updateStatus(id, status);
    if (!row) throw new Error('FLAG_NOT_FOUND');
    return row;
  }
}