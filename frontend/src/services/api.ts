import { Property, CreatePropertyInput, UpdatePropertyInput } from '../types/property.types';

const API_BASE_URL = (import.meta.env as any).VITE_API_URL || 'http://localhost:3000/api';

class ApiError extends Error {
  constructor(
    public status: number, 
    message: string, 
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ 
      message: 'Une erreur est survenue' 
    }));
    throw new ApiError(response.status, error.message, error.details);
  }
  
  if (response.status === 204) {
    return undefined as T;
  }
  
  return response.json();
}

export const propertyApi = {
  async getAll(): Promise<Property[]> {
    const response = await fetch(`${API_BASE_URL}/properties`);
    return handleResponse<Property[]>(response);
  },

  async getById(id: string): Promise<Property> {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`);
    return handleResponse<Property>(response);
  },

  async create(data: CreatePropertyInput): Promise<Property> {
    const response = await fetch(`${API_BASE_URL}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<Property>(response);
  },

  async update(id: string, data: UpdatePropertyInput): Promise<Property> {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<Property>(response);
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'DELETE'
    });
    return handleResponse<void>(response);
  }
};