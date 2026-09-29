import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { users } from '../db/schema.ts';
import crypto from 'node:crypto';

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'owner' | 'customer';
}

function hashPassword(plain: string): string {
  // Hash sederhana (scrypt bawaan Node) supaya tidak perlu install package baru.
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(plain, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export class UserRepository {
  async findAll() {
    const db = await getDb();
    return db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(users.id);
  }

  async findByEmail(email: string) {
    const db = await getDb();
    const rows = await db.select().from(users).where(eq(users.email, email));
    return rows[0];
  }

  async create(input: CreateUserInput) {
    const db = await getDb();
    const rows = await db
      .insert(users)
      .output()
      .values({
        name: input.name,
        email: input.email,
        passwordHash: hashPassword(input.password),
        role: input.role,
      });
    return rows[0];
  }
}