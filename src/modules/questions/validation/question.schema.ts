import {z} from 'zod';

const stringField = (typeMsg: string, emptyMsg: string) =>
  z.any()
    .refine(val => typeof val === 'string', { message: typeMsg })
    .refine(val => val.length > 0, { message: emptyMsg });

export const createQuestionSchema = z.object({
  title: stringField("El valor de 'title' es incorrecto, debe ser un string", "El título es requerido"),
  description: stringField("El valor de 'description' es incorrecto, debe ser un string", "La descripción es requerida"),
});



export const deleteQuestionSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'El ID debe ser un número válido'),
});