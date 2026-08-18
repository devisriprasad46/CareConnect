import React, { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { api } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const CreateRequestForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ['food'],
    quantity: '',
    urgencyLevel: 'medium',
    location: '',
    imageURL: ''
  });
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryToggle = (categoryValue) => {
    setFormData(prev => {
      const current = prev.category || [];
      const updated = current.includes(categoryValue)
        ? current.filter(c => c !== categoryValue)
        : [...current, categoryValue];
      return { ...prev, category: updated };
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const data = new FormData();
    data.append('file', file);

    try {
      const response = await api.post('/api/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data && response.data.success) {
        setFormData(prev => ({ ...prev, imageURL: response.data.data }));
        toast.success('Image uploaded successfully!');
      } else {
        throw new Error(response.data?.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Image upload failed. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || formData.category.length === 0) {
      toast.error('Please select at least one category');
      return;
    }
    setLoading(true);

    try {
      if (!user?.userId) throw new Error('You must be logged in as NGO to create requests');
      const requestData = { 
        ...formData, 
        category: formData.category.join(','),
        orgId: user.userId,
        quantity: formData.quantity ? parseInt(formData.quantity) : null 
      };
      await api.post('/api/requests', requestData);
      toast.success('Request created successfully!');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'food', label: 'Food', icon: '🍎' },
    { value: 'clothes', label: 'Clothes', icon: '👕' },
    { value: 'money', label: 'Money', icon: '💰' },
    { value: 'beds', label: 'Beds', icon: '🛏️' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-red-600' }
  ];

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Request Title *</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="input-field" placeholder="e.g., Need food supplies for 50 families" required />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="input-field" rows="4" placeholder="Provide detailed information about what you need and why..." required />
        </div>

        {/* Category and Urgency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category * (Select multiple if needed)</label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => {
                const isSelected = formData.category.includes(category.value);
                return (
                  <label key={category.value} className={`relative flex items-center p-3 border rounded-lg cursor-pointer ${isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}`}>
                    <input type="checkbox" name="category" value={category.value} checked={isSelected} onChange={() => handleCategoryToggle(category.value)} className="sr-only" />
                    <span className="text-2xl mr-2">{category.icon}</span>
                    <span className="text-sm font-medium">{category.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level *</label>
            <div className="space-y-2">
              {urgencyLevels.map((urgency) => (
                <label key={urgency.value} className={`relative flex items-center p-3 border rounded-lg cursor-pointer ${formData.urgencyLevel === urgency.value ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}`}>
                  <input type="radio" name="urgencyLevel" value={urgency.value} checked={formData.urgencyLevel === urgency.value} onChange={handleChange} className="sr-only" />
                  <AlertCircle className={`w-5 h-5 mr-2 ${urgency.color}`} />
                  <span className="text-sm font-medium">{urgency.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Quantity and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity (Optional)</label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="input-field" placeholder="e.g., 50" min="1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="input-field" placeholder="e.g., Mumbai, Maharashtra" required />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Request Image (Optional)</label>
          <div className="flex items-center space-x-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            {formData.imageURL && (
              <div className="shrink-0">
                <img className="h-16 w-16 object-cover rounded-lg border border-gray-300 shadow-sm" src={formData.imageURL} alt="Request preview" />
              </div>
            )}
            <label className="block cursor-pointer">
              <span className="sr-only">Choose image</span>
              <div className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700 font-semibold bg-white px-4 py-2 rounded-md border border-gray-300 shadow-sm hover:bg-gray-50">
                <Upload className="w-4 h-4" />
                <span>{uploadingImage ? 'Uploading...' : 'Upload Local Image'}</span>
              </div>
              <input type="file" onChange={handleImageUpload} className="sr-only" accept="image/*" disabled={uploadingImage} />
            </label>
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">Or paste image URL manually</label>
            <input type="text" name="imageURL" value={formData.imageURL} onChange={handleChange} className="input-field py-2" placeholder="https://example.com/image.jpg" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Upload a local image file or paste an image URL to show donors what is needed.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-6 border-t border-gray-200">
          {onCancel && (
            <button type="button" onClick={onCancel} className="flex-1 btn-outline">Cancel</button>
          )}
          <button type="submit" disabled={loading || uploadingImage} className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Creating Request...' : 'Create Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRequestForm;
