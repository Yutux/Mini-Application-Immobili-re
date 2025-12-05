import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { propertyApi } from '../services/api';
import { Property } from '../types/property.types';
import PropertyForm from '../components/PropertyForm';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function PropertyFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode && id) {
      loadProperty(id);
    }
  }, [id, isEditMode]);

  const loadProperty = async (propertyId: string) => {
    try {
      setLoading(true);
      const data = await propertyApi.getById(propertyId);
      setProperty(data);
    } catch (err: any) {
      alert(err.message || 'Erreur lors du chargement de la propriété');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (isEditMode && id) {
        await propertyApi.update(id, data);
      } else {
        await propertyApi.create(data);
      }
      navigate('/');
    } catch (err: any) {
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back button */}
      <Link
        to={isEditMode ? `/properties/${id}` : '/'}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Retour
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEditMode ? 'Modifier le bien' : 'Ajouter un bien'}
        </h1>
        <p className="text-gray-600">
          {isEditMode 
            ? 'Modifiez les informations du bien immobilier'
            : 'Remplissez les informations du nouveau bien'
          }
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <PropertyForm
          initialData={property || undefined}
          onSubmit={handleSubmit}
          submitLabel={isEditMode ? 'Enregistrer les modifications' : 'Créer le bien'}
        />
      </div>
    </div>
  );
}