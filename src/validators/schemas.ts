import { z } from 'zod';

const userRole = z.enum(['admin', 'owner', 'customer']);
const optionalText = (max: number) => z.string().trim().max(max).nullable().optional();

export const registerSchema = z.object({
  name: z.string().trim().min(3, { error: 'name minimal 3 karakter' }).max(100),
  email: z.string().trim().email({ error: 'format email tidak valid' }).max(150),
  password: z.string().min(8, { error: 'password minimal 8 karakter' }).max(128),
}).strict();

export const loginSchema = z.object({
  email: z.string().trim().email().max(150),
  password: z.string().min(1).max(128),
}).strict();

export const createUserSchema = registerSchema.extend({ role: userRole }).strict();

export const createStallSchema = z.object({
  name: z.string().trim().min(1).max(100),
  category: optionalText(50),
  location: optionalText(100),
  description: optionalText(4000),
}).strict();

export const updateStallSchema = createStallSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'Minimal satu field harus diisi.',
);

export const createMenuItemSchema = z.object({
  stallId: z.number().int().positive(),
  name: z.string().trim().min(1).max(100),
  price: z.number().int().nonnegative(),
  isAvailable: z.boolean().optional(),
}).strict();

export const updateMenuItemSchema = z.object({
  stallId: z.number().int().positive().optional(),
  name: z.string().trim().min(1).max(100).optional(),
  price: z.number().int().nonnegative().optional(),
  isAvailable: z.boolean().optional(),
}).strict().refine((value) => Object.keys(value).length > 0, 'Minimal satu field harus diisi.');

export const createReviewSchema = z.object({
  stallId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  comment: optionalText(4000),
}).strict();

export const createLikeSchema = z.object({
  reviewId: z.number().int().positive(),
}).strict();

export const createAuditLogSchema = z.object({
  action: z.string().trim().min(1).max(50),
  targetTable: z.string().trim().min(1).max(50),
  targetId: z.number().int().positive(),
  metadata: optionalText(4000),
}).strict();

export const updateFlagSchema = z.object({
  status: z.enum(['pending', 'resolved', 'dismissed']),
}).strict();

export const stallListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().max(100).optional(),
  category: z.string().trim().max(50).optional(),
}).strict();

export const reviewListQuerySchema = z.object({
  stallId: z.coerce.number().int().positive().optional(),
}).strict();

export const flagListQuerySchema = z.object({
  status: z.enum(['pending', 'resolved', 'dismissed']).optional(),
}).strict();