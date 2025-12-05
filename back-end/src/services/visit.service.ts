import { Visit, CreateVisitDTO, UpdateVisitDTO } from '../models/visit.model';
import { NotFoundError, ValidationError } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid';

// Données initiales test
let visits: Visit[] = [
  {
    id: uuidv4(),
    propertyId: 'property-example-id',
    date: new Date(Date.now() + 86400000).toISOString(),
    visitorName: 'Marie Dubois',
    notes: 'Première visite, intéressée par le bien'
  },
  {
    id: uuidv4(),
    propertyId: 'property-example-id-2',
    date: new Date(Date.now() + 172800000).toISOString(),
    visitorName: 'Pierre Martin',
    notes: 'Visite en famille'
  }
];

export class VisitService {
  async findAll(): Promise<Visit[]> {
    // Trier par date
    return [...visits].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async findById(id: string): Promise<Visit> {
    const visit = visits.find(v => v.id === id);
    
    if (!visit) {
      throw new NotFoundError(`Visite avec l'ID ${id} introuvable`);
    }
    
    return visit;
  }

  async findByPropertyId(propertyId: string): Promise<Visit[]> {
    return visits.filter(v => v.propertyId === propertyId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async create(data: CreateVisitDTO): Promise<Visit> {
    this.validateVisitDate(data.date);

    const newVisit: Visit = {
      id: uuidv4(),
      ...data
    };
    
    visits.push(newVisit);
    return newVisit;
  }

  async update(id: string, data: UpdateVisitDTO): Promise<Visit> {
    const index = visits.findIndex(v => v.id === id);
    
    if (index === -1) {
      throw new NotFoundError(`Visite avec l'ID ${id} introuvable`);
    }

    if (data.date) {
      this.validateVisitDate(data.date);
    }
    
    visits[index] = {
      ...visits[index],
      ...data,
      id
    };
    
    return visits[index];
  }

  async delete(id: string): Promise<void> {
    const index = visits.findIndex(v => v.id === id);
    
    if (index === -1) {
      throw new NotFoundError(`Visite avec l'ID ${id} introuvable`);
    }
    
    visits.splice(index, 1);
  }

  async getUpcomingVisits(): Promise<Visit[]> {
    const now = new Date();
    return visits
      .filter(v => new Date(v.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getPastVisits(): Promise<Visit[]> {
    const now = new Date();
    return visits
      .filter(v => new Date(v.date) <= now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getVisitsByDateRange(startDate: string, endDate: string): Promise<Visit[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return visits.filter(v => {
      const visitDate = new Date(v.date);
      return visitDate >= start && visitDate <= end;
    });
  }

  private validateVisitDate(dateString: string): void {
    const visitDate = new Date(dateString);
    const now = new Date();

    if (isNaN(visitDate.getTime())) {
      throw new ValidationError('Date de visite invalide');
    }

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    if (visitDate < oneYearAgo) {
      throw new ValidationError('La date de visite ne peut pas être plus d\'un an dans le passé');
    }
  }
}