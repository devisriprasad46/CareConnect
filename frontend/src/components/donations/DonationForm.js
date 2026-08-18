import React, { useState } from 'react';
import { X, Package, DollarSign } from 'lucide-react';
import { api } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import RazorpayButton from '../payments/RazorpayButton';

const DonationForm = ({ request, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ donationType: 'money', amount: '', quantity: '', message: '' });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!user?.userId) throw new Error('Please log in to donate');
      const payload = {
        requestId: request.requestId || request.id,
        donorId: user.userId,
        donationType: formData.donationType.charAt(0).toUpperCase() + formData.donationType.slice(1),
        message: formData.message || undefined,
        amount: formData.donationType === 'money' ? parseFloat(formData.amount) : undefined,
        quantity: formData.donationType === 'item' ? parseInt(formData.quantity) : undefined
      };
      await api.post('/api/donations', payload);
      toast.success('Donation submitted successfully!');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit donation');
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpaySuccess = async (response) => {
    try {
      if (!user?.userId) throw new Error('Please log in to donate');
      const payload = {
        requestId: request.requestId || request.id,
        donorId: user.userId,
        donationType: 'Money',
        amount: parseFloat(formData.amount),
        message: formData.message || undefined,
        status: 'confirmed'
      };
      await api.post('/api/donations', payload);
      toast.success('Payment successful! Donation submitted.');
      onSuccess();
    } catch (error) {
      toast.error('Payment verification failed');
    }
  };

  const handleRazorpayError = (error) => { toast.error(`Payment failed: ${error}`); };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Make a Donation</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
          </div>

          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">{request.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{request.description}</p>
            <p className="text-sm text-gray-500 mt-2">Requested by {request.organization?.name || 'Organization'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Donation Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Donation Type</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer ${formData.donationType === 'money' ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}`}>
                  <input type="radio" name="donationType" value="money" checked={formData.donationType === 'money'} onChange={handleChange} className="sr-only" />
                  <DollarSign className="w-5 h-5 mr-2 text-primary-600" />
                  <span className="text-sm font-medium">Money</span>
                </label>
                <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer ${formData.donationType === 'item' ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}`}>
                  <input type="radio" name="donationType" value="item" checked={formData.donationType === 'item'} onChange={handleChange} className="sr-only" />
                  <Package className="w-5 h-5 mr-2 text-primary-600" />
                  <span className="text-sm font-medium">Item</span>
                </label>
              </div>
            </div>

            {/* Amount or Quantity */}
            {formData.donationType === 'money' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="input-field pl-10" placeholder="0.00" min="1" step="0.01" required />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="input-field pl-10" placeholder="1" min="1" required />
                </div>
              </div>
            )}

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
              <textarea name="message" value={formData.message} onChange={handleChange} className="input-field" rows="3" placeholder="Add a message with your donation..." />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button type="button" onClick={onClose} className="flex-1 btn-outline">Cancel</button>
              {formData.donationType === 'money' ? (
                <RazorpayButton amount={parseFloat(formData.amount)} onSuccess={handleRazorpaySuccess} onError={handleRazorpayError} requestId={request.id} />
              ) : (
                <button type="submit" disabled={loading} className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed">{loading ? 'Submitting...' : 'Submit Donation'}</button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;


