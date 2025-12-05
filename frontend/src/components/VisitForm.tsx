import { useState, FormEvent, useEffect } from 'react';
import { Visit } from '../types/visit.types';
import { Loader2 } from 'lucide-react';
import { propertyApi } from '../services/api';
import { Property } from '../types/property.types';

interface VisitFormProps {
  initialData?: Visit;
  onSubmit: (data: any) => Promise<void>;
  submitLabel: string;
  preselectedPropertyId?: string;
}

export default function VisitForm({ 
  initialData, 
  onSubmit, 
  submitLabel,
  preselectedPropertyId 
}: VisitFormProps) {
  const [loading, setLoading] = useState(false);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    propertyId: preselectedPropertyId || initialData?.propertyId || '',
    date: initialData?.date ? new Date(initialData.date).toISOString().slice(0, 16) : '',
    visitorName: initialData?.visitorName || '',
    notes: initialData?.notes || ''
  });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await propertyApi.getAll();
      setProperties(data);
    } catch (err) {
      console.error('Erreur chargement propriétés:', err);
    } finally {
      setLoadingProperties(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.propertyId) {
      newErrors.propertyId = 'Veuillez sélectionner une propriété';
    }
    if (!formData.date) {
      newErrors.date = 'La date est obligatoire';
    }
    if (!formData.visitorName.trim()) {
      newErrors.visitorName = 'Le nom du visiteur est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      // Convertir la date au format ISO
      const submitData = {
        ...formData,
        date: new Date(formData.date).toISOString()
      };
      await onSubmit(submitData);
    } catch (err: any) {
      alert(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (loadingProperties) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Propriété */}
      <div>
        <label htmlFor="propertyId" className="block text-sm font-medium text-gray-700 mb-2">
          Propriété *
        </label>
        <select
          id="propertyId"
          value={formData.propertyId}
          onChange={(e) => handleChange('propertyId', e.target.value)}
          disabled={!!preselectedPropertyId}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
            errors.propertyId ? 'border-red-500' : 'border-gray-300'
          } ${preselectedPropertyId ? 'bg-gray-100' : ''}`}
        >
          <option value="">Sélectionnez une propriété</option>
          {properties.map((property) => (
            <option key={property.id} value={property.id}>
              {property.title} - {property.city}
            </option>
          ))}
        </select>
        {errors.propertyId && (
          <p className="mt-1 text-sm text-red-600">{errors.propertyId}</p>
        )}
      </div>

      {/* Date et Heure */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
          Date et heure de la visite *
        </label>
        <input
          id="date"
          type="datetime-local"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
            errors.date ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date}</p>
        )}
      </div>

      {/* Nom du visiteur */}
      <div>
        <label htmlFor="visitorName" className="block text-sm font-medium text-gray-700 mb-2">
          Nom du visiteur *
        </label>
        <input
          id="visitorName"
          type="text"
          value={formData.visitorName}
          onChange={(e) => handleChange('visitorName', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
            errors.visitorName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Jean Dupont"
        />
        {errors.visitorName && (
          <p className="mt-1 text-sm text-red-600">{errors.visitorName}</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Notes (optionnel)
        </label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
          placeholder="Informations complémentaires sur la visite..."
        />
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Enregistrement...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}