import React, { useState } from 'react';
import { api } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const CreateEventForm = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '' /* yyyy-mm-dd */,
    location: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!user?.userId) throw new Error('Please log in as NGO to create events');
      const payload = {
        creatorId: user.userId,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location || undefined
      };
      await api.post('/api/events', payload);
      toast.success('Event created successfully');
      onSuccess && onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
        <input name="title" value={formData.title} onChange={handleChange} className="input-field" placeholder="Community Cleanup Drive" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
        <textarea name="description" value={formData.description} onChange={handleChange} className="input-field" rows="4" placeholder="Describe the event..." required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location (optional)</label>
          <input name="location" value={formData.location} onChange={handleChange} className="input-field" placeholder="City, Venue" />
        </div>
      </div>
      <div className="flex space-x-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-outline flex-1">Cancel</button>
        )}
        <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">{loading ? 'Creating...' : 'Create Event'}</button>
      </div>
    </form>
  );
};

export default CreateEventForm;


