import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Heart, Calendar, Package } from 'lucide-react';
import { api } from '../utils/api';
import RequestCard from '../components/requests/RequestCard';
import EventCard from '../components/events/EventCard';
import DonationForm from '../components/donations/DonationForm';
import CreateEventForm from '../components/events/CreateEventForm';
import { useAuth } from '../contexts/AuthContext';

const VolunteerDashboard = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [requests, setRequests] = useState([]);
  const [events, setEvents] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', urgency: '', location: '' });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    try {
      const [requestsRes, eventsRes, donationsRes] = await Promise.all([
        api.get('/api/requests'),
        api.get('/api/events'),
        api.get('/api/donations')
      ]);
      setRequests(requestsRes.data.data || []);
      setEvents(eventsRes.data.data || []);
      const allDonations = donationsRes.data.data || [];
      setDonations(user?.userId ? allDonations.filter(d => String(d.donorId) === String(user.userId)) : allDonations);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleFilterChange = (key, value) => { setFilters(prev => ({ ...prev, [key]: value })); };

  const filteredRequests = requests.filter(request => {
    if (filters.category && (!request.category || !request.category.split(',').map(c => c.trim()).includes(filters.category))) return false;
    if (filters.urgency && request.urgencyLevel !== filters.urgency) return false;
    if (filters.location && !request.location?.toLowerCase().includes(filters.location.toLowerCase())) return false;
    return true;
  });

  const myJoinedEvents = events.filter(event => {
    if (event.participants) {
      if (Array.isArray(event.participants)) { return event.participants.some(p => String(p.id || p.userId) === String(user?.userId)); }
      if (typeof event.participants === 'string') {
        try { const parsed = JSON.parse(event.participants); return Array.isArray(parsed) && parsed.some(p => String(p.id || p.userId) === String(user?.userId)); } catch { return false; }
      }
    }
    return false;
  });

  const handleDonate = (request) => { setSelectedRequest(request); setShowDonationModal(true); };

  const tabs = [
    { id: 'browse', label: 'Browse Requests', icon: Search },
    { id: 'donations', label: 'My Donations', icon: Heart },
    { id: 'create-event', label: 'Create Event', icon: Plus },
    { id: 'joined-events', label: 'Joined Events', icon: Calendar }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Volunteer Dashboard</h1>
          <p className="text-gray-600 mt-2">Make a difference in your community</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => { const Icon = tab.icon; return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === tab.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  <Icon className="w-5 h-5 mr-2" />{tab.label}
                </button>
              );})}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Browse Requests Tab */}
          {activeTab === 'browse' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Available Requests</h2>
                <div className="flex space-x-4">
                  <select value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="">All Categories</option>
                    <option value="food">Food</option>
                    <option value="clothes">Clothes</option>
                    <option value="money">Money</option>
                    <option value="beds">Beds</option>
                  </select>
                  <select value={filters.urgency} onChange={(e) => handleFilterChange('urgency', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="">All Urgency</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {filteredRequests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRequests.map((request) => (
                    <RequestCard 
                      key={request.id} 
                      request={request} 
                      actionText="Donate Now"
                      onAction={() => handleDonate(request)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No requests found</h3>
                  <p className="text-gray-500">Try adjusting your filters or check back later.</p>
                </div>
              )}
            </div>
          )}

          {/* My Donations Tab */}
          {activeTab === 'donations' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">My Donations</h2>
              {donations.length > 0 ? (
                <div className="space-y-4">
                  {donations.map((donation) => (
                    <div key={donation.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{donation.request?.title}</h3>
                          <p className="text-gray-600 text-sm">{donation.request?.description}</p>
                          <p className="text-sm text-gray-500 mt-2">Donated on {new Date(donation.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${donation.status === 'completed' ? 'bg-green-100 text-green-800' : donation.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>{donation.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No donations yet</h3>
                  <p className="text-gray-500">Start making a difference by donating to requests.</p>
                </div>
              )}
            </div>
          )}

          {/* Create Event Tab */}
          {activeTab === 'create-event' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Event</h2>
              <CreateEventForm onSuccess={() => { fetchData(); setActiveTab('joined-events'); }} onCancel={() => setActiveTab('browse')} />
            </div>
          )}

          {/* Joined Events Tab */}
          {activeTab === 'joined-events' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">My Joined Events</h2>
              {myJoinedEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myJoinedEvents.map((event) => (<EventCard key={event.id} event={event} />))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No joined events</h3>
                  <p className="text-gray-500">Join events to see them here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Donation Modal */}
      {showDonationModal && selectedRequest && (
        <DonationForm request={selectedRequest} onClose={() => { setShowDonationModal(false); setSelectedRequest(null); }} onSuccess={() => { setShowDonationModal(false); setSelectedRequest(null); fetchData(); }} />
      )}
    </div>
  );
};

export default VolunteerDashboard;


