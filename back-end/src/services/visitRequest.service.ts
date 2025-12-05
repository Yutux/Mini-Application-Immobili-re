import { VisitRequest, CreateVisitRequestDTO } from '../models/visitRequest.model';
import { NotFoundError } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid';

let visitRequests: VisitRequest[] = [];

export class VisitRequestService {
  async findAll(): Promise<VisitRequest[]> {
    return visitRequests;
  }

  async findById(id: string): Promise<VisitRequest> {
    const request = visitRequests.find(r => r.id === id);
    
    if (!request) {
      throw new NotFoundError(`Demande de visite avec l'ID ${id} introuvable`);
    }
    
    return request;
  }

  async create(data: CreateVisitRequestDTO): Promise<VisitRequest> {
    const newRequest: VisitRequest = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString()
    };
    
    visitRequests.push(newRequest);
    return newRequest;
  }

  async delete(id: string): Promise<void> {
    const index = visitRequests.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw new NotFoundError(`Demande de visite avec l'ID ${id} introuvable`);
    }
    
    visitRequests.splice(index, 1);
  }
}