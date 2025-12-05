import { Property, CreatePropertyDTO, UpdatePropertyDTO, PropertyType, PropertyStatus } from '../models/property.model';
import { NotFoundError } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid';
import { UploadService } from './upload.service';

// bdd simulée
let properties: Property[] = [
  {
    id: uuidv4(),
    title: 'Appartement lumineux',
    description: 'Bel appartement avec vue sur parc',
    city: 'Paris',
    price: 350000,
    surface: 65,
    rooms: 3,
    type: PropertyType.APARTMENT,
    status: PropertyStatus.FOR_SALE, 
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    title: 'Maison avec jardin',
    description: 'Charmante maison individuelle',
    city: 'Lyon',
    price: 450000,
    surface: 120,
    rooms: 5,
    type: PropertyType.HOUSE,
    status: PropertyStatus.FOR_SALE, 
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export class PropertyService {

  // Retourne toutes les propriétés
  async findAll(): Promise<Property[]> {
    return properties;
  }

  // Trouve une propriété ou  erreur
  async findById(id: string): Promise<Property> {
    const property = properties.find(p => p.id === id);
    
    if (!property) {
      throw new NotFoundError(`Propriété avec l'ID ${id} introuvable`);
    }
    
    return property;
  }

  async safeFindById(id: string): Promise<Property | null> {
    return properties.find(p => p.id === id) || null;
  }

  // Créer une propriété
  async create(data: CreatePropertyDTO): Promise<Property> {
    const newProperty: Property = {
      id: uuidv4(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    properties.push(newProperty);
    return newProperty;
  }

  // Mettre à jour une propriété
  async update(id: string, data: UpdatePropertyDTO): Promise<Property> {
    const index = properties.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new NotFoundError(`Propriété avec l'ID ${id} introuvable`);
    }
    
    properties[index] = {
      ...properties[index],
      ...data,
      updatedAt: new Date()
    };
    
    return properties[index];
  }

  // Ajouter une image à une propriété
  async addImage(id: string, imageUrl: string): Promise<Property> {
  const property = await this.findById(id);
  
  if (!property.images) {
    property.images = [];
  }
  
  property.images.push(imageUrl);
  property.updatedAt = new Date();
  
  return property;
}

// Supprimer une propriété
async delete(id: string): Promise<boolean> {
  const property = await this.safeFindById(id);
  if (!property) return false;

  // Supprimer toutes les images associées
  if (property.images && property.images.length > 0) {
    const uploadService = new UploadService();
    await uploadService.deleteMultipleFiles(property.images);
  }

  const index = properties.findIndex(p => p.id === id);
  if (index === -1) return false;

  properties.splice(index, 1);
  return true;
}
}
