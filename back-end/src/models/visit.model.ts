export interface Visit {
  id: string;
  propertyId: string;
  date: string;
  visitorName: string;
  notes?: string;
}

//DTO
export type CreateVisitDTO = Omit<Visit, 'id'>;
export type UpdateVisitDTO = Partial<CreateVisitDTO>;
