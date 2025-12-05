import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';
import { uploadConfig } from '../config/upload.config';
import { ValidationError } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid';

export class UploadService {
  async saveFile(buffer: Buffer, filename: string, mimetype: string): Promise<string> {

    if (!uploadConfig.allowedMimeTypes.includes(mimetype)) {
      throw new ValidationError(
        `Type de fichier non autorisé. Types acceptés : ${uploadConfig.allowedMimeTypes.join(', ')}`
      );
    }
    const uploadDir = uploadConfig.uploadDir;

    // Générer un nom de fichier unique
    const ext = path.extname(filename);
    const uniqueFilename = `${uuidv4()}${ext}`;
    const filepath = path.join(uploadDir, uniqueFilename);

    // Sauvegarder le fichier depuis le buffer
    await fsPromises.writeFile(filepath, buffer);

    const imageUrl = `/uploads/properties/${uniqueFilename}`;
    
    console.log(` Fichier sauvegardé:`);
    console.log(`   - Chemin physique: ${filepath}`);
    console.log(`   - URL publique: ${imageUrl}`);
    console.log(`   - Taille: ${buffer.length} bytes`);

    return imageUrl;
  }

  async deleteFile(imageUrl: string): Promise<void> {
    try {
      // imageUrl format: /uploads/properties/filename.jpg
      // Extraire juste le nom du fichier
      const filename = path.basename(imageUrl);
      const filepath = path.join(uploadConfig.uploadDir, filename);

      // Vérifier que le fichier existe
      if (fs.existsSync(filepath)) {
        await fsPromises.unlink(filepath);
        console.log(`Image supprimée : ${filename}`);
      } else {
        console.warn(`Fichier introuvable : ${filepath}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier:', error);
    }
  }

  async deleteMultipleFiles(imageUrls: string[]): Promise<void> {
    for (const url of imageUrls) {
      await this.deleteFile(url);
    }
  }

  getFileSize(filepath: string): number {
    try {
      const stats = fs.statSync(filepath);
      return stats.size;
    } catch (error) {
      return 0;
    }
  }
}