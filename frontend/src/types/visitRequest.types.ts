export interface VisitRequest {
  id: string;
  propertyId: string;
  requesterName: string;
  requesterEmail: string;
  message?: string;
  createdAt: string;
}

export type CreateVisitRequestInput = Omit<VisitRequest, 'id' | 'createdAt'>;