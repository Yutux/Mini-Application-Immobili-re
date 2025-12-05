import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { visitApi } from '../services/visitApi';
import { Visit } from '../types/visit.types';
import VisitForm from '../components/VisitForm';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function VisitFormPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const preselectedPropertyId = searchParams.get('propertyId');

  const [visit, setVisit] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode && id) {
      loadVisit(id);
    }
  }, [id, isEditMode]);

  const loadVisit = async (visitId: string) => {
    try {
      setLoading(true);
      const data = await visitApi.getById(visitId);
      setVisit(data);
    } catch (err: any) {
      alert(err.message || 'Erreur lors du chargement de la visite');
      navigate('/visits');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (isEditMode && id) {
        await visitApi.update(id, data);
      } else {
        await visitApi.create(data);
      }
      navigate('/visits');
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
        to="/visits"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Retour aux visites
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEditMode ? 'Modifier la visite' : 'Planifier une visite'}
        </h1>
        <p className="text-gray-600">
          {isEditMode 
            ? 'Modifiez les informations de la visite'
            : 'Remplissez les informations pour planifier une visite'
          }
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <VisitForm
          initialData={visit || undefined}
          onSubmit={handleSubmit}
          submitLabel={isEditMode ? 'Enregistrer les modifications' : 'Planifier la visite'}
          preselectedPropertyId={preselectedPropertyId || undefined}
        />
      </div>
    </div>
  );
}