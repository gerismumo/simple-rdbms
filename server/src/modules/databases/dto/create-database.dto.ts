import { z } from 'zod';

export const CreateDatabaseSchema = z.object({
  name: z.string()
    .min(1, 'Database name is required')
    .max(50, 'Database name too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Database name must be alphanumeric with underscores only'),
});

export type CreateDatabaseDto = z.infer<typeof CreateDatabaseSchema>;