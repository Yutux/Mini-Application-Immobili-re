import { z } from 'zod';
import { PropertyType, PropertyStatus } from '../models/property.model';

export const propertySchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères').max(100),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  city: z.string().min(2, 'La ville doit contenir au moins 2 caractères'),
  price: z.number().positive('Le prix doit être positif'),
  surface: z.number().positive('La surface doit être positive'),
  rooms: z.number().int().positive('Le nombre de pièces doit être positif'),
  type: z.nativeEnum(PropertyType),
  status: z.nativeEnum(PropertyStatus)
});

export const updatePropertySchema = propertySchema.partial();

export const propertyIdSchema = z.object({
  id: z.string().uuid('ID invalide')
});

export type PropertyInput = z.infer<typeof propertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;