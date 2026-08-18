import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Clock } from 'lucide-react';

const EventCard = ({ event }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getParticipantsCount = () => {
    if (event.participants) {
      if (Array.isArray(event.participants)) return event.participants.length;
      if (typeof event.participants === 'string') {
        try {
          const parsed = JSON.parse(event.participants);
          return Array.isArray(parsed) ? parsed.length : 0;
        } catch { return 0; }
      }
    }
    return 0;
  };

  const isUpcoming = (dateString) => new Date(dateString) > new Date();

  return (
    <div className="card hover:shadow-xl transition-all duration-200 group">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-lg mb-4 overflow-hidden">
        {event.imageURL ? (
          <img src={event.imageURL} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-16 h-16 text-secondary-400" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${isUpcoming(event.date) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {isUpcoming(event.date) ? 'Upcoming' : 'Past Event'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">{event.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">{event.description}</p>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            <span>{formatTime(event.date)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{event.location || 'Location TBD'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 mr-2" />
            <span>{getParticipantsCount()} participants</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-gray-500">by {event.creator?.name || 'Event Organizer'}</div>
          <div className="text-xs text-gray-400">Created {new Date(event.createdAt).toLocaleDateString()}</div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          {isUpcoming(event.date) ? (
            <Link to={`/events/${event.eventId || event.id}`} className="w-full btn-primary text-center block">
              <Users className="w-4 h-4 inline mr-2" />
              Join Event
            </Link>
          ) : (
            <Link to={`/events/${event.eventId || event.id}`} className="w-full btn-outline text-center block">View Details</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;


