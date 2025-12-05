export interface VisitRequest {
  id: string;
  propertyId: string;
  requesterName: string;
  requesterEmail: string;
  message?: string;
  createdAt: string;
}
//DTO
export type CreateVisitRequestDTO = Omit<VisitRequest, 'id' | 'createdAt'>;
