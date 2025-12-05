import { useEffect, useState } from 'react';
import { visitApi } from '../services/visitApi';
import { Visit } from '../types/visit.types';
import VisitCard from '../components/VisitCard';
import { Loader2, AlertCircle, Calendar, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function VisitsPage() {
  const navigate = useNavigate();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    loadVisits();
  }, []);

  const loadVisits = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await visitApi.getAll();
      setVisits(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des visites');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette visite ?')) {
      return;
    }

    try {
      await visitApi.delete(id);
      setVisits(prev => prev.filter(v => v.id !== id));
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression');
    }
  };

  const filteredVisits = visits.filter(visit => {
    const visitDate = new Date(visit.date);
    const now = new Date();

    if (filter === 'upcoming') return visitDate > now;
    if (filter === 'past') return visitDate <= now;
    return true;
  });

  const sortedVisits = [...filteredVisits].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const upcomingCount = visits.filter(v => new Date(v.date) > new Date()).length;
  const pastCount = visits.filter(v => new Date(v.date) <= new Date()).length;

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
          onClick={loadVisits}
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Calendar size={32} className="text-blue-600" />
            Visites Planifiées
          </h1>
          <p className="text-gray-600">
            {visits.length} visite{visits.length > 1 ? 's' : ''} au total
          </p>
        </div>

        <button
          onClick={() => navigate('/visits/new')}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus size={20} />
          Nouvelle visite
        </button>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Toutes ({visits.length})
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'upcoming'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          À venir ({upcomingCount})
        </button>
        <button
          onClick={() => setFilter('past')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'past'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Passées ({pastCount})
        </button>
      </div>

      {/* Liste des visites */}
      {sortedVisits.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">
            {filter === 'all' 
              ? 'Aucune visite planifiée pour le moment.'
              : filter === 'upcoming'
              ? 'Aucune visite à venir.'
              : 'Aucune visite passée.'}
          </p>
          <button
            onClick={() => navigate('/visits/new')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Planifier une visite
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedVisits.map((visit) => (
            <VisitCard
              key={visit.id}
              visit={visit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}