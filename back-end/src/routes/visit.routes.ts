import { FastifyInstance } from 'fastify';
import { VisitService } from '../services/visit.service';
import { PropertyService } from '../services/property.service';
import { visitSchemaJSON, updateVisitSchemaJSON, visitIdSchemaJSON } from '../schemas/visit.Schema.json';

// Services
const visitService = new VisitService();
const propertyService = new PropertyService();

export default async function visitRoutes(server: FastifyInstance) {

  // GET /visits
  server.get('/visits', async () => {
    return await visitService.findAll();
  });

  // GET /visits/:id
  server.get('/visits/:id', {
    schema: { params: visitIdSchemaJSON }
  }, async (request, reply) => {
    const { id } = request.params as any;
    const visit = await visitService.findById(id);
    return reply.send(visit);
  });

  // POST /visits
  server.post('/visits', {
    schema: { body: visitSchemaJSON }
  }, async (request, reply) => {
    const body = request.body as any;

    // Vérifier que la propriété existe
    try {
      await propertyService.findById(body.propertyId);
    } catch {
      return reply.code(400).send({
        message: "La propriété n'existe pas",
        propertyId: body.propertyId,
      });
    }

    const visit = await visitService.create(body);
    return reply.code(201).send(visit);
  });

  // PUT /visits/:id
  server.put('/visits/:id', {
    schema: {
      params: visitIdSchemaJSON,
      body: updateVisitSchemaJSON
    }
  }, async (request, reply) => {
    const { id } = request.params as any;
    const updated = await visitService.update(id, request.body as any);
    return reply.code(200).send(updated);
  });

  // DELETE /visits/:id
  server.delete('/visits/:id', {
    schema: { params: visitIdSchemaJSON }
  }, async (request, reply) => {
    const { id } = request.params as any;
    await visitService.delete(id);
    return reply.code(204).send();
  });
}
