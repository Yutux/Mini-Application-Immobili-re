import { useState } from 'react';
import { X, Loader2, ZoomIn } from 'lucide-react';
import { uploadApi } from '../services/uploadApi';

interface ImageGalleryProps {
  propertyId: string;
  images: string[];
  onImageDeleted: (imageUrl: string) => void;
  canDelete?: boolean;
}

export default function ImageGallery({ 
  propertyId, 
  images, 
  onImageDeleted,
  canDelete = true 
}: ImageGalleryProps) {
  const [deletingImage, setDeletingImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleDelete = async (imageUrl: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      return;
    }

    try {
      setDeletingImage(imageUrl);
      await uploadApi.deleteImage(propertyId, imageUrl);
      onImageDeleted(imageUrl);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression');
    } finally {
      setDeletingImage(null);
    }
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-600">Aucune image pour cette propriété</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((imageUrl, index) => (
          <div
            key={imageUrl}
            className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
          >
            <img
              src={uploadApi.getImageUrl(imageUrl)}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2">
              <button
                onClick={() => setSelectedImage(imageUrl)}
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100"
              >
                <ZoomIn size={18} />
              </button>

              {canDelete && (
                <button
                  onClick={() => handleDelete(imageUrl)}
                  disabled={deletingImage === imageUrl}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white p-2 rounded-full hover:bg-red-700 disabled:opacity-50"
                >
                  {deletingImage === imageUrl ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <X size={18} />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100"
          >
            <X size={24} />
          </button>
          <img
            src={uploadApi.getImageUrl(selectedImage)}
            alt="Image agrandie"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}