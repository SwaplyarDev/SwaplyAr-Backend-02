import {z} from 'zod';

export const createQuestionSchema = z.object({
    title: z.string().min(1, "El título es requerido"),
    description: z.string().min(1, "La descripción es requerida"),

});

export const deleteQuestionSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'El ID debe ser un número válido'),
});