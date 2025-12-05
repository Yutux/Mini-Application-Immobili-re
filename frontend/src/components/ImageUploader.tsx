import { useState, useRef } from 'react';
import { Upload, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface ImageUploaderProps {
  propertyId: string;
  onUploadSuccess: (imageUrl: string) => void;
}

export default function ImageUploader({ propertyId, onUploadSuccess }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('Le fichier est trop volumineux (max 5MB)');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Type de fichier non autorisé. Utilisez JPEG, PNG, WebP ou GIF');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setSuccess(false);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/upload/property/${propertyId}`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'upload');
      }

      const data = await response.json();
      setSuccess(true);
      onUploadSuccess(data.imageUrl);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setTimeout(() => setSuccess(false), 3000);

    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div>
        <label
          htmlFor="image-upload"
          className={`flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            uploading 
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
              : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin text-blue-600" size={20} />
              <span className="text-gray-600">Upload en cours...</span>
            </>
          ) : (
            <>
              <Upload className="text-blue-600" size={20} />
              <span className="text-gray-700 font-medium">
                Ajouter une image
              </span>
            </>
          )}
        </label>
        <input
          ref={fileInputRef}
          id="image-upload"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
        <p className="text-xs text-gray-500 mt-2">
          JPEG, PNG, WebP ou GIF • Max 5MB
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-green-800">Image uploadée avec succès !</p>
        </div>
      )}
    </div>
  );
}