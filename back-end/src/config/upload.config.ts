import path from 'path';
import fs from 'fs';

export const uploadConfig = {
  // Dossier de stockage des images
  uploadDir: path.join(process.cwd(), 'uploads', 'properties'),
  
  // Taille max : 5MB
  maxFileSize: 5 * 1024 * 1024,
  
  // Extensions autorisées
  allowedMimeTypes: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
  ],
  
  // URL de base pour servir les images
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  
  // Créer le dossier s'il n'existe pas
  ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      console.log(`📁 Dossier uploads créé : ${this.uploadDir}`);
    }
  }
};

// Créer le dossier au démarrage
uploadConfig.ensureUploadDir();