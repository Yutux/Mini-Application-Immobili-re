export enum PropertyType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  STUDIO = 'studio',
  LOFT = 'loft',
}

// Statuts
export enum PropertyStatus {
  FOR_SALE = 'for_sale',
  FOR_RENT = 'for_rent',
  SOLD = 'sold',
  RENTED = 'rented',
}

export interface Property {
  id: string;
  title: string;
  images?: string[];
  description: string;
  city: string;
  price: number;
  surface: number;
  rooms: number;
  type: PropertyType;
  status: PropertyStatus;
  createdAt: Date;
  updatedAt: Date;
}

// DTO 
export type CreatePropertyDTO = Omit<Property, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePropertyDTO = Partial<CreatePropertyDTO>;
