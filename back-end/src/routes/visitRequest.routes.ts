import { FastifyInstance } from "fastify";
import { VisitRequestService } from "../services/visitRequest.service";
import { z } from "zod";
import {updateVisitRequestSchemaJSON, visitRequestIdSchemaJSON, visitRequestSchemaJSON} from "../schemas/visit.RequestSchema.json";

// ----- ZOD SCHEMAS -----
const visitRequestIdSchema = z.object({
  id: z.string().uuid('ID invalide')
});

// Service
const visitRequestService = new VisitRequestService();

export default async function visitRequestRoutes(server: FastifyInstance) {

  // GET /api/visit-requests
  server.get("/visit-requests", async () => {
    return await visitRequestService.findAll();
  });

  // GET /api/visit-requests/:id
  server.get("/visit-requests/:id", {
    schema: { params: visitRequestIdSchemaJSON }
  }, async (request, reply) => {
    const { id } = request.params as any;

    try {
      const visitRequest = await visitRequestService.findById(id);
      return reply.code(200).send(visitRequest);
    } catch (error: any) {
      if (error.statusCode === 404) {
        return reply.code(404).send({
          message: 'Demande de visite introuvable',
          id
        });
      }
      throw error;
    }
  });

  // POST /api/visit-requests
  server.post("/visit-requests", {
    schema: { body: visitRequestSchemaJSON }
  }, async (request, reply) => {
    const visitRequest = await visitRequestService.create(request.body as any);
    return reply.code(201).send(visitRequest);
  });

  // DELETE /api/visit-requests/:id
  server.delete("/visit-requests/:id", {
    schema: { params: visitRequestIdSchemaJSON }
  }, async (request, reply) => {
    const { id } = request.params as any;

    try {
      await visitRequestService.delete(id);
      return reply.code(204).send();
    } catch (error: any) {
      if (error.statusCode === 404) {
        return reply.code(404).send({
          message: 'Demande de visite introuvable',
          id
        });
      }
      throw error;
    }
  });
}
