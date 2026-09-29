import { UserRepository, type CreateUserInput } from '../repositories/userRepository.ts';
import type { UserResponseDto } from '../dtos/userDto.ts';

type UserRow = { id: number; name: string; email: string; role: string; createdAt: Date | string | null };

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  private toDto(row: UserRow): UserResponseDto {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role as UserResponseDto['role'],
      createdAt: row.createdAt,
    };
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const rows = await this.userRepository.findAll();
    return rows.map((row) => this.toDto(row));
  }

  async createUser(input: CreateUserInput): Promise<UserResponseDto> {
    if (!input.name || !input.email || !input.password || !input.role) {
      throw new Error('USER_INVALID_INPUT');
    }
    if (!['admin', 'owner', 'customer'].includes(input.role)) {
      throw new Error('USER_INVALID_ROLE');
    }
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) throw new Error('USER_EMAIL_TAKEN');

    const row = await this.userRepository.create(input);
    if (!row) throw new Error('USER_CREATE_FAILED');
    return this.toDto(row as unknown as UserRow);
  }
}