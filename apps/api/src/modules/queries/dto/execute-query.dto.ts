import { z } from 'zod';

export const ExecuteQuerySchema = z.object({
  sql: z.string().min(1, 'SQL query is required'),
  database: z.string().optional(),
});

export type ExecuteQueryDto = z.infer<typeof ExecuteQuerySchema>;
