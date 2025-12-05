import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { env } from './config/env';
import visitRoutes from "./routes/visit.routes";
import visitRequestRoutes from "./routes/visitRequest.routes";
import propertyRoutes from './routes/property.routes';
import { errorHandler } from './utils/errors';
import uploadRoutes from './routes/upload.routes';

const server = Fastify({
  logger: true
});

const start = async () => {
  try {
      // CORS
    await server.register(cors, {
      origin: true,
      credentials: true
    });

    // Multipart pour upload
    await server.register(multipart, {
      limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
      }
    });

    // Servir les fichiers statiques
    const uploadsPath = path.join(process.cwd(), 'uploads');
    console.log(`Dossier uploads: ${uploadsPath}`);
    
    await server.register(fastifyStatic, {
      root: uploadsPath,
      prefix: '/uploads/',
      decorateReply: false
    });

    // Global error handler
    server.setErrorHandler(errorHandler);

    // Routes API
    await server.register(propertyRoutes, { prefix: '/api' });
    await server.register(uploadRoutes, { prefix: '/api' });
    await server.register(visitRoutes, { prefix: "/api" });
    await server.register(visitRequestRoutes, { prefix: "/api" });

    // Health check
    server.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

    await server.listen({ 
      port: env.PORT, 
      host: '0.0.0.0' 
    });
    
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
    console.log(`📸 Images: http://localhost:${env.PORT}/uploads/properties/`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
