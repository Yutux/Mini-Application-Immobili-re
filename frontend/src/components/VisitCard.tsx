import { Calendar, User, Clock, FileText, Edit, Trash2 } from 'lucide-react';
import { Visit } from '../types/visit.types';
import { useNavigate } from 'react-router-dom';

interface VisitCardProps {
  visit: Visit;
  onDelete?: (id: string) => void;
  showPropertyLink?: boolean;
}

export default function VisitCard({ visit, onDelete, showPropertyLink = true }: VisitCardProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUpcoming = () => {
    return new Date(visit.date) > new Date();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={18} className={isUpcoming() ? 'text-blue-600' : 'text-gray-400'} />
            <span className={`font-semibold ${isUpcoming() ? 'text-blue-600' : 'text-gray-600'}`}>
              {formatDate(visit.date)}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-700">
            <User size={16} />
            <span>{visit.visitorName}</span>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          isUpcoming() 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {isUpcoming() ? 'À venir' : 'Passée'}
        </span>
      </div>

      {/* Notes */}
      {visit.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <FileText size={16} className="mt-0.5 flex-shrink-0" />
            <p className="line-clamp-2">{visit.notes}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {showPropertyLink && (
          <button
            onClick={() => navigate(`/properties/${visit.propertyId}`)}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Voir la propriété
          </button>
        )}
        
        <button
          onClick={() => navigate(`/visits/${visit.id}/edit`)}
          className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-2"
        >
          <Edit size={16} />
          Modifier
        </button>
        
        {onDelete && (
          <button
            onClick={() => onDelete(visit.id)}
            className="bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}