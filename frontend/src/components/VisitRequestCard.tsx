import { Mail, User, MessageSquare, Clock, Trash2 } from 'lucide-react';
import { VisitRequest } from '../types/visitRequest.types';
import { useNavigate } from 'react-router-dom';

interface VisitRequestCardProps {
  request: VisitRequest;
  onDelete?: (id: string) => void;
  onConvertToVisit?: (request: VisitRequest) => void;
}

export default function VisitRequestCard({ 
  request, 
  onDelete, 
  onConvertToVisit 
}: VisitRequestCardProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <User size={18} className="text-blue-600" />
            <span className="font-semibold text-gray-900">{request.requesterName}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <Mail size={14} />
            <a 
              href={`mailto:${request.requesterEmail}`}
              className="hover:text-blue-600 transition-colors"
            >
              {request.requesterEmail}
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={14} />
            <span>Reçu le {formatDate(request.createdAt)}</span>
          </div>
        </div>

        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
          En attente
        </span>
      </div>

      {/* Message */}
      {request.message && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MessageSquare size={16} className="mt-0.5 flex-shrink-0" />
            <p className="line-clamp-3">{request.message}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/properties/${request.propertyId}`)}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Voir la propriété
        </button>
        
        {onConvertToVisit && (
          <button
            onClick={() => onConvertToVisit(request)}
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Planifier
          </button>
        )}
        
        {onDelete && (
          <button
            onClick={() => onDelete(request.id)}
            className="bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}