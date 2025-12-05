import { Home, MapPin, Euro, Maximize } from 'lucide-react';
import { Property, PropertyTypeLabels, PropertyStatusLabels } from '../types/property.types';
import { useNavigate } from 'react-router-dom';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 fade-in group">
      {/* ajouté image */}
      <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-all">
        <Home size={48} className="text-blue-600 opacity-50" />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
              {property.title}
            </h3>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin size={14} className="mr-1" />
              {property.city}
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full whitespace-nowrap">
            {PropertyStatusLabels[property.status]}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Maximize size={14} className="mr-1" />
            {property.surface} m²
          </div>
          <div>
            {property.rooms} pièce{property.rooms > 1 ? 's' : ''}
          </div>
          <div className="text-xs text-gray-500">
            {PropertyTypeLabels[property.type]}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline">
            <Euro size={18} className="text-gray-500 mr-1" />
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(property.price)}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/properties/${property.id}`)}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Voir
          </button>
          <button
            onClick={() => navigate(`/properties/${property.id}/edit`)}
            className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
          >
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
}