import { useEffect, useState } from 'react';
import { propertyApi } from '../services/api';
import { Property } from '../types/property.types';
import PropertyCard from '../components/PropertyCard';
import { Loader2, AlertCircle } from 'lucide-react';

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyApi.getAll();
      setProperties(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des propriétés');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadProperties}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Nos biens immobiliers
        </h1>
        <p className="text-gray-600">
          {properties.length} bien{properties.length > 1 ? 's' : ''} disponible{properties.length > 1 ? 's' : ''}
        </p>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-600">Aucun bien disponible pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}