import { z } from 'zod';

export const ColumnSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['INTEGER', 'VARCHAR', 'BOOLEAN', 'FLOAT']),
  primaryKey: z.boolean().optional(),
  unique: z.boolean().optional(),
  nullable: z.boolean().optional(),
  maxLength: z.number().optional(),
});

export const CreateTableSchema = z.object({
  name: z.string().min(1, 'Table name is required'),
  columns: z.array(ColumnSchema).min(1, 'At least one column is required'),
});

export type CreateTableDto = z.infer<typeof CreateTableSchema>;