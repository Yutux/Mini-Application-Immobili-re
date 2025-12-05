import { FastifyRequest, FastifyReply } from 'fastify';
import { uploadConfig } from '../config/upload.config';
import { MultipartFile } from '@fastify/multipart';

export async function uploadMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    const file: MultipartFile | undefined = await request.file();
    
    if (!file) {
      return reply.code(400).send({ message: 'Aucun fichier fourni' });
    }

    const buffer = await file.toBuffer();

    // Vérifier la taille du fichier
    if (buffer.length > uploadConfig.maxFileSize) {
      return reply.code(400).send({
        message: `Fichier trop volumineux. Taille max: ${uploadConfig.maxFileSize / 1024 / 1024}MB`,
      });
    }
    if (uploadConfig.allowedMimeTypes && !uploadConfig.allowedMimeTypes.includes(file.mimetype)) {
      return reply.code(400).send({
        message: `Type de fichier non autorisé. Types acceptés: ${uploadConfig.allowedMimeTypes.join(', ')}`
      });
    }

    // Stocker les informations du fichier sur la requête pour la route
    (request as any).upload = { 
      buffer, 
      filename: file.filename, 
      mimetype: file.mimetype 
    };
  } catch (error) {
    request.log.error({ err: error }, 'Erreur dans uploadMiddleware');
    return reply.code(500).send({ 
      message: 'Erreur lors du traitement du fichier',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}