const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const uploadApi = {
  async uploadImage(propertyId: string, file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload/property/${propertyId}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        message: 'Erreur lors de l\'upload' 
      }));
      throw new ApiError(response.status, error.message);
    }

    return response.json();
  },

  async deleteImage(propertyId: string, imageUrl: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/upload/property/${propertyId}/image`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        message: 'Erreur lors de la suppression' 
      }));
      throw new ApiError(response.status, error.message);
    }
  },

  getImageUrl(imageUrl: string): string {
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';
    return `${baseUrl}${imageUrl}`;
  }
};