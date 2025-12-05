import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { UploadService } from '../services/upload.service';
import { PropertyService } from '../services/property.service';
import { uploadMiddleware } from '../middlewares/upload.middleware';

const uploadService = new UploadService();
const propertyService = new PropertyService();

export default async function uploadRoutes(server: FastifyInstance) {
  // POST /upload/property/:propertyId
  server.post(
    '/upload/property/:propertyId',
    { preHandler: uploadMiddleware },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { propertyId } = request.params as { propertyId?: string };
        
        if (!propertyId) {
          return reply.code(400).send({ message: 'propertyId manquant' });
        }

        const property = await propertyService.findById(propertyId);
        if (!property) {
          return reply.code(404).send({ message: 'Propriété introuvable' });
        }

        const { buffer, filename, mimetype } = (request as any).upload;
        
        if (!buffer || !filename || !mimetype) {
          return reply.code(400).send({ message: 'Données de fichier invalides' });
        }

        const imageUrl = await uploadService.saveFile(buffer, filename, mimetype);
        const updatedProperty = await propertyService.addImage(propertyId, imageUrl);

        return reply.code(201).send({
          message: 'Image uploadée avec succès',
          imageUrl,
          property: updatedProperty,
        });
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({
          message: 'Erreur lors de l\'upload',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  );

  // DELETE /upload/property/:propertyId/image
  server.delete(
    '/upload/property/:propertyId/image',
    {
      schema: {
        body: {
          type: 'object',
          required: ['imageUrl'],
          properties: { imageUrl: { type: 'string' } },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { propertyId } = request.params as { propertyId?: string };
        
        if (!propertyId) {
          return reply.code(400).send({ message: 'propertyId manquant' });
        }

        const { imageUrl } = request.body as { imageUrl: string };

        const property = await propertyService.findById(propertyId);
        if (!property) {
          return reply.code(404).send({ message: 'Propriété introuvable' });
        }

        if (!property.images?.includes(imageUrl)) {
          return reply.code(404).send({ message: 'Image introuvable pour cette propriété' });
        }

        await uploadService.deleteFile(imageUrl);

        const updatedImages = property.images.filter((url) => url !== imageUrl);
        const updatedProperty = await propertyService.update(propertyId, { images: updatedImages });

        return reply.code(200).send({
          message: 'Image supprimée avec succès',
          property: updatedProperty,
        });
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({
          message: 'Erreur lors de la suppression',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  );
}