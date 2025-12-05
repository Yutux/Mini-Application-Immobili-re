import { VisitRequest, CreateVisitRequestInput } from '../types/visitRequest.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ 
      message: 'Une erreur est survenue' 
    }));
    throw new ApiError(response.status, error.message);
  }
  
  if (response.status === 204) {
    return undefined as T;
  }
  
  return response.json();
}

export const visitRequestApi = {
  async getAll(): Promise<VisitRequest[]> {
    const response = await fetch(`${API_BASE_URL}/visit-requests`);
    return handleResponse<VisitRequest[]>(response);
  },

  async getById(id: string): Promise<VisitRequest> {
    const response = await fetch(`${API_BASE_URL}/visit-requests/${id}`);
    return handleResponse<VisitRequest>(response);
  },

  async create(data: CreateVisitRequestInput): Promise<VisitRequest> {
    const response = await fetch(`${API_BASE_URL}/visit-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<VisitRequest>(response);
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/visit-requests/${id}`, {
      method: 'DELETE'
    });
    return handleResponse<void>(response);
  },

  // Helper pour obtenir les demandes d'une propriété
  async getByPropertyId(propertyId: string): Promise<VisitRequest[]> {
    const requests = await this.getAll();
    return requests.filter(r => r.propertyId === propertyId);
  }
};