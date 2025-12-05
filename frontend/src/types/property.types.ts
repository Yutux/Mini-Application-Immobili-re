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
  createdAt: string;
  updatedAt: string;
}

export enum PropertyType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  STUDIO = 'studio',
  LOFT = 'loft'
}

export enum PropertyStatus {
  FOR_SALE = 'for_sale',
  FOR_RENT = 'for_rent',
  SOLD = 'sold',
  RENTED = 'rented'
}

export type CreatePropertyInput = Omit<Property, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePropertyInput = Partial<CreatePropertyInput>;

export const PropertyTypeLabels: Record<PropertyType, string> = {
  [PropertyType.APARTMENT]: 'Appartement',
  [PropertyType.HOUSE]: 'Maison',
  [PropertyType.STUDIO]: 'Studio',
  [PropertyType.LOFT]: 'Loft'
};

export const PropertyStatusLabels: Record<PropertyStatus, string> = {
  [PropertyStatus.FOR_SALE]: 'À vendre',
  [PropertyStatus.FOR_RENT]: 'À louer',
  [PropertyStatus.SOLD]: 'Vendu',
  [PropertyStatus.RENTED]: 'Loué'
};