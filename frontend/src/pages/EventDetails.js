import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, ArrowLeft, User } from 'lucide-react';
import { api } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  const fetchEventDetails = useCallback(async () => {
    try {
      const [eventRes, participantsRes] = await Promise.all([
        api.get('/api/events'),
        api.get(`/api/events/${id}/participants`)
      ]);
      const allEvents = eventRes.data.data || [];
      setEvent(allEvents.find(e => String(e.eventId || e.id) === String(id)) || null);
      setParticipants(participantsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching event details:', error);
      toast.error('Failed to load event details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchEventDetails(); }, [fetchEventDetails]);

  const handleJoinEvent = async () => {
    if (!user) {
      toast.error('Please log in to join events');
      navigate('/login');
      return;
    }
    setJoining(true);
    try {
      await api.post(`/api/events/${id}/join`);
      toast.success('Successfully joined the event!');
      fetchEventDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join event');
    } finally { setJoining(false); }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const isUpcoming = (dateString) => new Date(dateString) > new Date();
  const isUserParticipant = () => participants.some(participant => String(participant.id || participant.userId) === String(user?.userId));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h2>
          <button onClick={() => navigate('/events')} className="btn-primary">Back to Events</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button onClick={() => navigate('/events')} className="flex items-center text-primary-600 hover:text-primary-700 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Events
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Event Image */}
          <div className="relative h-64 md:h-80 bg-gradient-to-br from-secondary-100 to-secondary-200">
            {event.imageURL ? (
              <img src={event.imageURL} alt={event.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Calendar className="w-24 h-24 text-secondary-400" />
              </div>
            )}
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${isUpcoming(event.date) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {isUpcoming(event.date) ? 'Upcoming' : 'Past Event'}
              </span>
            </div>
          </div>

          <div className="p-8">
            {/* Event Title and Creator */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
              <div className="flex items-center text-gray-600">
                <User className="w-5 h-5 mr-2" />
                <span>Created by {event.creator?.name || 'Event Organizer'}</span>
              </div>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{formatDate(event.date)}</p>
                    <p className="text-sm text-gray-600">{formatTime(event.date)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{event.location || 'Location TBD'}</p>
                    <p className="text-sm text-gray-600">Event Location</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{participants.length} participants</p>
                    <p className="text-sm text-gray-600">Registered</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">About This Event</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>

            {/* Action Buttons */}
            {isUpcoming(event.date) && (
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  isUserParticipant() ? (
                    <div className="btn-outline cursor-not-allowed"><Users className="w-5 h-5 inline mr-2" />Already Joined</div>
                  ) : (
                    <button onClick={handleJoinEvent} disabled={joining} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                      <Users className="w-5 h-5 inline mr-2" />
                      {joining ? 'Joining...' : 'Join Event'}
                    </button>
                  )
                ) : (
                  <button onClick={() => navigate('/login')} className="btn-primary">
                    <Users className="w-5 h-5 inline mr-2" />
                    Login to Join
                  </button>
                )}
              </div>
            )}

            {/* Participants List */}
            {participants.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Participants</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <User className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{participant.name}</p>
                        <p className="text-sm text-gray-600">{participant.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;


