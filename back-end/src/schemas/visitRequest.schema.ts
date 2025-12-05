import { z } from "zod";

export const visitRequestSchema = z.object({
  propertyId: z.string().min(1),
  requesterName: z.string().min(1),
  requesterEmail: z.string().email(),
  message: z.string().optional(),
});

export type VisitRequestDTO = z.infer<typeof visitRequestSchema>;
