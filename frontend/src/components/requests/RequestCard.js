import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, User, Heart } from 'lucide-react';

const RequestCard = ({ request, actionText, onAction }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'status-open';
      case 'in_progress': return 'status-progress';
      case 'fulfilled': return 'status-fulfilled';
      case 'expired': return 'status-expired';
      default: return 'status-open';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open': return '🟢 Open';
      case 'in_progress': return '🟡 In Progress';
      case 'fulfilled': return '🔴 Fulfilled';
      case 'expired': return '⚫ Expired';
      default: return '🟢 Open';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'food': return '🍎';
      case 'clothes': return '👕';
      case 'money': return '💰';
      case 'beds': return '🛏️';
      default: return '📦';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="card hover:shadow-xl transition-all duration-200 group">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 overflow-hidden">
        {request.imageURL ? (
          <img
            src={request.imageURL}
            alt={request.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center gap-3">
            {request.category ? String(request.category).split(',').map((cat, idx) => (
              <span key={idx} className="text-5xl" title={cat.trim()}>{getCategoryIcon(cat.trim())}</span>
            )) : <span className="text-6xl">📦</span>}
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={getStatusColor(request.status || 'open')}>
            {getStatusText(request.status || 'open')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {request.title}
          </h3>
        </div>

        <p className="text-gray-600 text-sm line-clamp-3">
          {request.description}
        </p>

        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{request.location || 'Location not specified'}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDate(request.createdAt)}</span>
          </div>
        </div>

        {request.quantity && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Quantity needed:</span> {request.quantity}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center text-sm text-gray-500">
            <User className="w-4 h-4 mr-1" />
            <span>by {request.organization?.name || 'Organization'}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              request.urgencyLevel === 'high' 
                ? 'bg-red-100 text-red-800' 
                : request.urgencyLevel === 'medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {request.urgencyLevel?.toUpperCase() || 'LOW'}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          {onAction ? (
            <button
              onClick={onAction}
              className="w-full btn-primary text-center block"
            >
              <Heart className="w-4 h-4 inline mr-2" />
              {actionText || 'Help Now'}
            </button>
          ) : (
            <Link
              to={`/requests/${request.requestId || request.id}`}
              className="w-full btn-primary text-center block"
            >
              <Heart className="w-4 h-4 inline mr-2" />
              Help Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestCard;


