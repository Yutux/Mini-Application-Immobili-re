import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Ressource introuvable') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Données invalides') {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  // Erreur de validation Zod
  if (error.validation) {
    return reply.code(400).send({
      statusCode: 400,
      error: 'Validation Error',
      message: 'Données invalides',
      details: error.validation
    });
  }

  // Erreurs custom
  if (error instanceof AppError) {
    return reply.code(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.name,
      message: error.message,
      code: error.code
    });
  }

  // Erreur inconnue
  console.error(error);
  return reply.code(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'Une erreur interne est survenue'
  });
};