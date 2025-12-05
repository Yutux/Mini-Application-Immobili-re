import { z } from "zod";

export const visitSchema = z.object({
  propertyId: z.string().min(1),
  date: z.string().datetime(),
  visitorName: z.string().min(1),
  notes: z.string().optional()
});

export const updateVisitSchema = visitSchema.partial();

export type VisitInput = z.infer<typeof visitSchema>;
export type UpdateVisitInput = z.infer<typeof updateVisitSchema>;