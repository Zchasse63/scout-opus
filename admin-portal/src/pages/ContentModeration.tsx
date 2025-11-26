import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

type ContentType = 'photos' | 'reviews' | 'gym_data';

interface ModerationItem {
  id: string;
  type: ContentType;
  status: 'pending' | 'approved' | 'rejected';
  submitted_by: string;
  submitted_at: string;
  gym_name: string;
  content: any;
}

export default function ContentModeration() {
  const [contentType, setContentType] = useState<ContentType>('photos');
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, [contentType, filter]);

  const loadItems = async () => {
    setLoading(true);
    try {
      let query;

      if (contentType === 'photos') {
        query = supabase
          .from('gym_photos')
          .select(`
            *,
            gym:gyms(name),
            user:users(name)
          `);
      } else if (contentType === 'reviews') {
        query = supabase
          .from('gym_reviews')
          .select(`
            *,
            gym:gyms(name),
            user:users(name)
          `);
      } else {
        query = supabase
          .from('gym_verification_queue')
          .select('*');
      }

      if (filter !== 'all') {
        query = query.eq('moderation_status', filter);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      setItems(data || []);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (item: ModerationItem) => {
    try {
      let table = '';
      if (contentType === 'photos') table = 'gym_photos';
      else if (contentType === 'reviews') table = 'gym_reviews';
      else table = 'gym_verification_queue';

      const { error } = await supabase
        .from(table)
        .update({
          moderation_status: 'approved',
          moderated_at: new Date().toISOString(),
        })
        .eq('id', item.id);

      if (error) throw error;

      // Award points to user for approved content
      // TODO: Implement points system

      alert('Content approved successfully!');
      loadItems();
      setSelectedItem(null);
    } catch (error) {
      console.error('Error approving content:', error);
      alert('Failed to approve content');
    }
  };

  const handleReject = async (item: ModerationItem) => {
    const reason = prompt('Please provide a rejection reason:');
    if (!reason) return;

    try {
      let table = '';
      if (contentType === 'photos') table = 'gym_photos';
      else if (contentType === 'reviews') table = 'gym_reviews';
      else table = 'gym_verification_queue';

      const { error } = await supabase
        .from(table)
        .update({
          moderation_status: 'rejected',
          moderated_at: new Date().toISOString(),
          rejection_reason: reason,
        })
        .eq('id', item.id);

      if (error) throw error;

      alert('Content rejected');
      loadItems();
      setSelectedItem(null);
    } catch (error) {
      console.error('Error rejecting content:', error);
      alert('Failed to reject content');
    }
  };

  const renderPhotoCard = (item: any) => (
    <div
      key={item.id}
      className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => setSelectedItem(item)}
    >
      <img
        src={item.url}
        alt="Gym photo"
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{item.gym?.name || 'Unknown Gym'}</h3>
        <p className="text-sm text-gray-600 mt-1">By {item.user?.name || 'Unknown User'}</p>
        <p className="text-xs text-gray-500 mt-2">
          {new Date(item.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );

  const renderReviewCard = (item: any) => (
    <div
      key={item.id}
      className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => setSelectedItem(item)}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-gray-900">{item.gym?.name || 'Unknown Gym'}</h3>
          <p className="text-sm text-gray-600">By {item.user?.name || 'Unknown User'}</p>
        </div>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < item.rating ? 'text-yellow-400' : 'text-gray-300'}>
              ★
            </span>
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-700 line-clamp-3">{item.review_text}</p>
      <p className="text-xs text-gray-500 mt-2">
        {new Date(item.created_at).toLocaleDateString()}
      </p>
    </div>
  );

  const renderGymDataCard = (item: any) => (
    <div
      key={item.id}
      className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => setSelectedItem(item)}
    >
      <h3 className="font-semibold text-gray-900 mb-2">{item.gym_name}</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-600">Address:</span>
          <p className="font-medium">{item.address}</p>
        </div>
        <div>
          <span className="text-gray-600">Phone:</span>
          <p className="font-medium">{item.phone || 'N/A'}</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Submitted {new Date(item.submitted_at).toLocaleDateString()}
      </p>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Content Moderation</h1>

        <div className="flex space-x-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setContentType('photos')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                contentType === 'photos'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Photos
            </button>
            <button
              onClick={() => setContentType('reviews')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                contentType === 'reviews'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Reviews
            </button>
            <button
              onClick={() => setContentType('gym_data')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                contentType === 'gym_data'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Gym Data
            </button>
          </div>

          <div className="flex space-x-2 ml-auto">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  filter === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Content</h3>
          <p className="text-gray-600">
            There are no {filter !== 'all' ? filter : ''} {contentType} to moderate.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            if (contentType === 'photos') return renderPhotoCard(item);
            if (contentType === 'reviews') return renderReviewCard(item);
            return renderGymDataCard(item);
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {contentType === 'photos' && 'Photo Moderation'}
                  {contentType === 'reviews' && 'Review Moderation'}
                  {contentType === 'gym_data' && 'Gym Data Moderation'}
                </h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {contentType === 'photos' && (
                <img
                  src={selectedItem.content?.url}
                  alt="Gym photo"
                  className="w-full rounded-lg mb-4"
                />
              )}

              {contentType === 'reviews' && (
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-2xl ${i < selectedItem.content?.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-700">{selectedItem.content?.review_text}</p>
                </div>
              )}

              <div className="space-y-2 mb-6 text-sm">
                <p><span className="text-gray-600">Submitted by:</span> {selectedItem.submitted_by}</p>
                <p><span className="text-gray-600">Gym:</span> {selectedItem.gym_name}</p>
                <p><span className="text-gray-600">Submitted:</span> {new Date(selectedItem.submitted_at).toLocaleString()}</p>
              </div>

              {selectedItem.status === 'pending' && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleReject(selectedItem)}
                    className="flex-1 flex items-center justify-center bg-red-600 text-white px-4 py-3 rounded-md hover:bg-red-700 font-semibold"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedItem)}
                    className="flex-1 flex items-center justify-center bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 font-semibold"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
