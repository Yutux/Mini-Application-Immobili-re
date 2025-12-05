import { FastifyInstance } from 'fastify';
import { PropertyService } from '../services/property.service';
import {
  propertySchemaJSON,
  updatePropertySchemaJSON,
  propertyIdSchemaJSON,
} from '../schemas/property.schema.json';

const propertyService = new PropertyService();

export default async function propertyRoutes(server: FastifyInstance) {
  // GET /properties
  server.get('/properties', async (request, reply) => {
    try {
      const allProperties = await propertyService.findAll();
      return reply.code(200).send(allProperties);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ 
        message: 'Erreur lors de la récupération des propriétés',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /properties/:id
  server.get('/properties/:id', { schema: { params: propertyIdSchemaJSON } }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const property = await propertyService.findById(id);
      
      if (!property) {
        return reply.code(404).send({ message: 'Property not found' });
      }
      
      return reply.send(property);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ 
        message: 'Erreur lors de la récupération de la propriété',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // POST /properties
  server.post('/properties', { schema: { body: propertySchemaJSON } }, async (request, reply) => {
    try {
      const property = await propertyService.create(request.body as any);
      return reply.code(201).send(property);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ 
        message: 'Erreur lors de la création de la propriété',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // PUT /properties/:id
  server.put(
    '/properties/:id',
    { schema: { params: propertyIdSchemaJSON, body: updatePropertySchemaJSON } },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        const property = await propertyService.update(id, request.body as any);
        
        if (!property) {
          return reply.code(404).send({ message: 'Property not found' });
        }
        
        return reply.send(property);
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ 
          message: 'Erreur lors de la mise à jour de la propriété',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  );

  // DELETE /properties/:id
  server.delete('/properties/:id', { schema: { params: propertyIdSchemaJSON } }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const deleted = await propertyService.delete(id);
      
      if (!deleted) {
        return reply.code(404).send({ message: 'Property not found' });
      }
      
      return reply.code(204).send();
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ 
        message: 'Erreur lors de la suppression de la propriété',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}