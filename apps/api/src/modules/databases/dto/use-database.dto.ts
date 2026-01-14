import { z } from 'zod';

export const UseDatabaseSchema = z.object({
  name: z.string().min(1, 'Database name is required'),
});

export type UseDatabaseDto = z.infer<typeof UseDatabaseSchema>;