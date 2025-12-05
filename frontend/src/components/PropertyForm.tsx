import { useState, FormEvent } from 'react';
import { Property, PropertyType, PropertyStatus, PropertyTypeLabels, PropertyStatusLabels } from '../types/property.types';
import { Loader2 } from 'lucide-react';

interface PropertyFormProps {
  initialData?: Property;
  onSubmit: (data: any) => Promise<void>;
  submitLabel: string;
}

export default function PropertyForm({ initialData, onSubmit, submitLabel }: PropertyFormProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    city: initialData?.city || '',
    price: initialData?.price || 0,
    surface: initialData?.surface || 0,
    rooms: initialData?.rooms || 1,
    type: initialData?.type || PropertyType.APARTMENT,
    status: initialData?.status || PropertyStatus.FOR_SALE
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.title.length < 3) {
      newErrors.title = 'Le titre doit contenir au moins 3 caractères';
    }
    if (formData.description.length < 10) {
      newErrors.description = 'La description doit contenir au moins 10 caractères';
    }
    if (formData.city.length < 2) {
      newErrors.city = 'La ville doit contenir au moins 2 caractères';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Le prix doit être positif';
    }
    if (formData.surface <= 0) {
      newErrors.surface = 'La surface doit être positive';
    }
    if (formData.rooms < 1) {
      newErrors.rooms = 'Le nombre de pièces doit être au moins 1';
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
      await onSubmit(formData);
    } catch (err: any) {
      alert(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Titre *
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ex: Appartement T3 lumineux"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Décrivez le bien..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* City */}
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
          Ville *
        </label>
        <input
          id="city"
          type="text"
          value={formData.city}
          onChange={(e) => handleChange('city', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
            errors.city ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ex: Paris"
        />
        {errors.city && (
          <p className="mt-1 text-sm text-red-600">{errors.city}</p>
        )}
      </div>

      {/* Grid: Price, Surface, Rooms */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Prix (€) *
          </label>
          <input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', Number(e.target.value))}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
            min="0"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>

        <div>
          <label htmlFor="surface" className="block text-sm font-medium text-gray-700 mb-2">
            Surface (m²) *
          </label>
          <input
            id="surface"
            type="number"
            value={formData.surface}
            onChange={(e) => handleChange('surface', Number(e.target.value))}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
              errors.surface ? 'border-red-500' : 'border-gray-300'
            }`}
            min="0"
          />
          {errors.surface && (
            <p className="mt-1 text-sm text-red-600">{errors.surface}</p>
          )}
        </div>

        <div>
          <label htmlFor="rooms" className="block text-sm font-medium text-gray-700 mb-2">
            Pièces *
          </label>
          <input
            id="rooms"
            type="number"
            value={formData.rooms}
            onChange={(e) => handleChange('rooms', Number(e.target.value))}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
              errors.rooms ? 'border-red-500' : 'border-gray-300'
            }`}
            min="1"
          />
          {errors.rooms && (
            <p className="mt-1 text-sm text-red-600">{errors.rooms}</p>
          )}
        </div>
      </div>

      {/* Grid: Type, Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
            Type de bien *
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value as PropertyType)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          >
            {Object.values(PropertyType).map((type) => (
              <option key={type} value={type}>
                {PropertyTypeLabels[type]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Statut *
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value as PropertyStatus)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          >
            {Object.values(PropertyStatus).map((status) => (
              <option key={status} value={status}>
                {PropertyStatusLabels[status]}
              </option>
            ))}
          </select>
        </div>
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
              Chargement...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}