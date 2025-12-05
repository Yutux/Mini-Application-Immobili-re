export interface Visit {
  id: string;
  propertyId: string;
  date: string;
  visitorName: string;
  notes?: string;
}

export type CreateVisitInput = Omit<Visit, 'id'>;
export type UpdateVisitInput = Partial<CreateVisitInput>;