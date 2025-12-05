import { Visit, CreateVisitInput, UpdateVisitInput } from '../types/visit.types';

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

export const visitApi = {
  async getAll(): Promise<Visit[]> {
    const response = await fetch(`${API_BASE_URL}/visits`);
    return handleResponse<Visit[]>(response);
  },

  async getById(id: string): Promise<Visit> {
    const response = await fetch(`${API_BASE_URL}/visits/${id}`);
    return handleResponse<Visit>(response);
  },

  async create(data: CreateVisitInput): Promise<Visit> {
    const response = await fetch(`${API_BASE_URL}/visits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<Visit>(response);
  },

  async update(id: string, data: UpdateVisitInput): Promise<Visit> {
    const response = await fetch(`${API_BASE_URL}/visits/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<Visit>(response);
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/visits/${id}`, {
      method: 'DELETE'
    });
    return handleResponse<void>(response);
  },

  // Helper pour obtenir les visites d'une propriété
  async getByPropertyId(propertyId: string): Promise<Visit[]> {
    const visits = await this.getAll();
    return visits.filter(v => v.propertyId === propertyId);
  }
};