import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Package, Heart, Calendar, Edit, Trash2, Eye } from 'lucide-react';
import { api } from '../utils/api';
import RequestCard from '../components/requests/RequestCard';
import EventCard from '../components/events/EventCard';
import CreateEventForm from '../components/events/CreateEventForm';
import CreateRequestForm from '../components/requests/CreateRequestForm';
import { useAuth } from '../contexts/AuthContext';

const NGODashboard = () => {
  const [activeTab, setActiveTab] = useState('my-requests');
  const { user } = useAuth();
  const [myRequests, setMyRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const [updatingDonationId, setUpdatingDonationId] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [requestsRes, eventsRes, donationsRes] = await Promise.all([
        api.get('/api/requests'),
        api.get('/api/events'),
        api.get('/api/donations')
      ]);
      // Filter by current NGO (if logged in)
      const allRequests = requestsRes.data.data || [];
      const allEvents = eventsRes.data.data || [];
      const allDonations = donationsRes.data.data || [];

      const myReqs = user?.userId ? allRequests.filter(r => String(r.orgId) === String(user.userId)) : allRequests;
      const myRequestIds = myReqs.map(r => String(r.requestId));

      setMyRequests(myReqs);
      setMyEvents(user?.userId ? allEvents.filter(e => String(e.creatorId) === String(user.userId)) : allEvents);
      setDonations(myRequestIds.length ? allDonations.filter(d => myRequestIds.includes(String(d.requestId))) : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => { fetchData(); }, [fetchData]);
  // When switching to Donations tab, refresh to show latest
  useEffect(() => {
    if (activeTab === 'donations') {
      fetchData();
    }
  }, [activeTab, fetchData]);

  const handleDeleteRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await api.delete(`/api/requests/${requestId}`);
        setMyRequests(prev => prev.filter(req => (req.requestId || req.id) !== requestId));
      } catch (error) {
        console.error('Error deleting request:', error);
      }
    }
  };

  const handleUpdateDonationStatus = async (donationId, status) => {
    try {
      setUpdatingDonationId(donationId);
      const url = `/api/donations/${donationId}/status`;
      await api.put(url, { status });
      // Auto-refresh list to reflect server truth
      await fetchData();
    } catch (error) {
      console.error('Error updating donation status:', error);
    } finally {
      setUpdatingDonationId(null);
    }
  };

  const tabs = [
    { id: 'my-requests', label: 'My Requests', icon: Package },
    { id: 'create-request', label: 'Create Request', icon: Plus },
    { id: 'donations', label: 'Donations Received', icon: Heart },
    { id: 'events', label: 'Events Hosted', icon: Calendar }
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
          <h1 className="text-3xl font-bold text-gray-900">NGO Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your requests and track donations</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === tab.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* My Requests Tab */}
          {activeTab === 'my-requests' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">My Requests</h2>
                <button onClick={() => setShowCreateRequest(true)} className="btn-primary">
                  <Plus className="w-5 h-5 inline mr-2" />
                  Create New Request
                </button>
              </div>

              {myRequests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myRequests.map((request) => (
                    <div key={request.requestId || request.id} className="relative">
                      <RequestCard request={request} />
                      <div className="absolute top-4 left-4 flex space-x-2">
                        <button onClick={() => {}} className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button onClick={() => handleDeleteRequest(request.requestId || request.id)} className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No requests created</h3>
                  <p className="text-gray-500 mb-6">Create your first request to start receiving donations.</p>
                  <button onClick={() => setShowCreateRequest(true)} className="btn-primary">
                    <Plus className="w-5 h-5 inline mr-2" />
                    Create Request
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Create Request Tab */}
          {activeTab === 'create-request' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Request</h2>
              <CreateRequestForm onSuccess={() => { fetchData(); setActiveTab('my-requests'); }} />
            </div>
          )}

          {/* Donations Received Tab */}
          {activeTab === 'donations' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Donations Received</h2>
                <button onClick={fetchData} className="btn-outline text-sm">Refresh</button>
              </div>
              {donations.length > 0 ? (
                <div className="space-y-4">
                  {donations.map((donation) => (
                    <div key={donation.donationId} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{donation.requestTitle}</h3>
                          <p className="text-gray-600 text-sm">Category: {donation.category}</p>
                          <p className="text-sm text-gray-500 mt-2">Donated by {donation.donorName} on {new Date(donation.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${String(donation.status).toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' : String(donation.status).toLowerCase() === 'confirmed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {donation.status}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        {String(donation.status).toLowerCase() === 'pending' && (
                          <>
                            <button disabled={updatingDonationId===donation.donationId} onClick={() => handleUpdateDonationStatus(donation.donationId, 'confirmed')} className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed">{updatingDonationId===donation.donationId? 'Updating...' : 'Confirm'}</button>
                            <button disabled={updatingDonationId===donation.donationId} onClick={() => handleUpdateDonationStatus(donation.donationId, 'completed')} className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed">{updatingDonationId===donation.donationId? 'Updating...' : 'Mark Complete'}</button>
                          </>
                        )}
                        {String(donation.status).toLowerCase() === 'confirmed' && (
                          <button disabled={updatingDonationId===donation.donationId} onClick={() => handleUpdateDonationStatus(donation.donationId, 'completed')} className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed">{updatingDonationId===donation.donationId? 'Updating...' : 'Mark Complete'}</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No donations received</h3>
                  <p className="text-gray-500">Create requests to start receiving donations.</p>
                </div>
              )}
            </div>
          )}

          {/* Events Hosted Tab */}
          {activeTab === 'events' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Events Hosted</h2>
                <button onClick={() => setActiveTab('create-event')} className="btn-primary"><Plus className="w-5 h-5 inline mr-2" />Create Event</button>
              </div>
              {myEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myEvents.map((event) => (
                    <div key={event.eventId || event.id} className="relative">
                      <EventCard event={event} />
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"><Eye className="w-4 h-4 text-gray-600" /></button>
                        <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"><Edit className="w-4 h-4 text-gray-600" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No events hosted</h3>
                  <p className="text-gray-500 mb-6">Create events to engage with your community.</p>
                  <button className="btn-primary"><Plus className="w-5 h-5 inline mr-2" />Create Event</button>
                </div>
              )}
            </div>
          )}

          {/* Create Event Tab */}
          {activeTab === 'create-event' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Event</h2>
              <CreateEventForm onSuccess={() => { fetchData(); setActiveTab('events'); }} onCancel={() => setActiveTab('events')} />
            </div>
          )}
        </div>
      </div>

      {/* Create Request Modal */}
      {showCreateRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Create New Request</h3>
                <button onClick={() => setShowCreateRequest(false)} className="text-gray-400 hover:text-gray-600">×</button>
              </div>
              <CreateRequestForm onSuccess={() => { setShowCreateRequest(false); fetchData(); }} onCancel={() => setShowCreateRequest(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NGODashboard;


