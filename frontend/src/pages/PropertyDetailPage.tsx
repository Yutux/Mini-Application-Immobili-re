import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { propertyApi } from '../services/api';
import { Property, PropertyTypeLabels, PropertyStatusLabels } from '../types/property.types';
import ImageGallery from '../components/ImageGallery';
import ImageUploader from '../components/ImageUploader';
import { 
  ArrowLeft, 
  MapPin, 
  Euro, 
  Maximize, 
  Home as HomeIcon,
  Image as ImageIcon,
  Edit, 
  Trash2,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      loadProperty(id);
    }
  }, [id]);

  const loadProperty = async (propertyId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyApi.getById(propertyId);
      setProperty(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement de la propriété');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?')) {
      return;
    }

    try {
      setDeleting(true);
      await propertyApi.delete(id);
      navigate('/');
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression');
    } finally {
      setDeleting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur</h2>
        <p className="text-gray-600 mb-4">{error || 'Propriété introuvable'}</p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Retour à la liste
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        tsx<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
  {/* Image principale ou placeholder */}
  {property.images && property.images.length > 0 ? (
    <img
      src={`http://localhost:3000${property.images[0]}`}
      alt={property.title}
      className="w-full h-96 object-cover"
      onError={(e) => {
        console.error(' Erreur chargement image:', property.images?.[0]);
        console.error('URL complète:', `http://localhost:3000${property.images?.[0]}`);
        // Cacher l'image si elle ne charge pas
        e.currentTarget.style.display = 'none';
      }}
      onLoad={() => {
        console.log('Image chargée avec succès:', property.images?.[0]);
      }}
    />
  ) : (
    <div className="h-96 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
      <HomeIcon size={80} className="text-blue-600 opacity-50" />
    </div>
  )}
</div>

        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {property.title}
              </h1>
              <div className="flex items-center text-gray-600">
                <MapPin size={18} className="mr-2" />
                {property.city}
              </div>
            </div>
            <span className="px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-full">
              {PropertyStatusLabels[property.status]}
            </span>
          </div>

          <div className="flex items-baseline mb-6 pb-6 border-b border-gray-200">
            <Euro size={28} className="text-gray-500 mr-2" />
            <span className="text-4xl font-bold text-gray-900">
              {formatPrice(property.price)}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6 pb-6 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-600 mb-1">Surface</p>
              <div className="flex items-center gap-2">
                <Maximize size={18} className="text-gray-400" />
                <span className="text-lg font-semibold text-gray-900">
                  {property.surface} m²
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Pièces</p>
              <span className="text-lg font-semibold text-gray-900">
                {property.rooms} pièce{property.rooms > 1 ? 's' : ''}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Type</p>
              <span className="text-lg font-semibold text-gray-900">
                {PropertyTypeLabels[property.type]}
              </span>
            </div>
          </div>

          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {property.description}
            </p>
          </div>

          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon size={24} className="text-blue-600" />
              Photos ({property.images?.length || 0})
            </h2>
            
            <ImageGallery
              propertyId={property.id}
              images={property.images || []}
              onImageDeleted={(imageUrl) => {
                setProperty(prev => prev ? {
                  ...prev,
                  images: prev.images?.filter(img => img !== imageUrl) || []
                } : null);
              }}
            />

            <div className="mt-6">
              <ImageUploader
                propertyId={property.id}
                onUploadSuccess={(imageUrl) => {
                  setProperty(prev => prev ? {
                    ...prev,
                    images: [...(prev.images || []), imageUrl]
                  } : null);
                }}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/properties/${property.id}/edit`)}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Edit size={20} />
              Modifier
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Trash2 size={20} />
              )}
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}