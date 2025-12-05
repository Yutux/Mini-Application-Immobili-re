import { useEffect, useState } from 'react';
import { visitRequestApi } from '../services/visitRequestApi';
import { VisitRequest } from '../types/visitRequest.types';
import VisitRequestCard from '../components/VisitRequestCard';
import { Loader2, AlertCircle, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function VisitRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<VisitRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await visitRequestApi.getAll();
      setRequests(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      return;
    }

    try {
      await visitRequestApi.delete(id);
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleConvertToVisit = (request: VisitRequest) => {
    // Rediriger vers le formulaire de création de visite avec les données pré-remplies
    navigate(`/visits/new?propertyId=${request.propertyId}&name=${encodeURIComponent(request.requesterName)}`);
  };

  const sortedRequests = [...requests].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

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
          onClick={loadRequests}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Inbox size={32} className="text-blue-600" />
          Demandes de Visite
        </h1>
        <p className="text-gray-600">
          {requests.length} demande{requests.length > 1 ? 's' : ''} en attente
        </p>
      </div>

      {/* Liste des demandes */}
      {sortedRequests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Inbox size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Aucune demande de visite pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRequests.map((request) => (
            <VisitRequestCard
              key={request.id}
              request={request}
              onDelete={handleDelete}
              onConvertToVisit={handleConvertToVisit}
            />
          ))}
        </div>
      )}
    </div>
  );
}