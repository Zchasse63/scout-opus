import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Send,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatDistanceToNow } from 'date-fns';

interface SupportTicket {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  subject: string;
  description: string;
  category: 'booking' | 'payment' | 'account' | 'technical' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  messages: TicketMessage[];
}

interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_type: 'user' | 'admin';
  sender_name: string;
  message: string;
  created_at: string;
}

export default function SupportTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filter, setFilter] = useState<'open' | 'in_progress' | 'resolved' | 'closed' | 'all'>('open');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, [filter]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('support_tickets')
        .select(`
          *,
          messages:ticket_messages(*)
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;

      setTickets(data || []);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', ticketId);

      if (error) throw error;

      loadTickets();
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus as any });
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
      alert('Failed to update status');
    }
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: selectedTicket.id,
          sender_type: 'admin',
          sender_name: 'Admin', // TODO: Get from auth
          message: replyMessage,
        });

      if (error) throw error;

      // Update ticket status to in_progress if it's open
      if (selectedTicket.status === 'open') {
        await handleUpdateStatus(selectedTicket.id, 'in_progress');
      }

      setReplyMessage('');
      loadTickets();

      // TODO: Send email notification to user
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply');
    }
  };

  const PriorityBadge = ({ priority }: { priority: string }) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[priority as keyof typeof colors]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
      open: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </span>
    );
  };

  return (
    <div className="p-8 flex h-screen">
      {/* Tickets List */}
      <div className="w-1/3 pr-4 border-r border-gray-200 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Support Tickets</h1>
          <div className="flex flex-wrap gap-2">
            {['all', 'open', 'in_progress', 'resolved', 'closed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  filter === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No tickets found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedTicket?.id === ticket.id
                    ? 'bg-indigo-50 border-2 border-indigo-200'
                    : 'bg-white border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{ticket.subject}</h3>
                    <p className="text-xs text-gray-600 mt-1">{ticket.user_name}</p>
                  </div>
                  <PriorityBadge priority={ticket.priority} />
                </div>
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">{ticket.description}</p>
                <div className="flex items-center justify-between">
                  <StatusBadge status={ticket.status} />
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ticket Detail */}
      <div className="flex-1 pl-4 flex flex-col">
        {selectedTicket ? (
          <>
            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedTicket.subject}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Ticket #{selectedTicket.id.slice(0, 8)} • Created {formatDistanceToNow(new Date(selectedTicket.created_at), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <PriorityBadge priority={selectedTicket.priority} />
                  <StatusBadge status={selectedTicket.status} />
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-1" />
                  {selectedTicket.user_name} ({selectedTicket.user_email})
                </div>
                <div className="text-gray-600">
                  Category: <span className="font-medium capitalize">{selectedTicket.category}</span>
                </div>
              </div>

              <div className="mt-4">
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {/* Initial ticket message */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                    <User className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{selectedTicket.user_name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(selectedTicket.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{selectedTicket.description}</p>
              </div>

              {/* Replies */}
              {selectedTicket.messages?.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-lg p-4 ${
                    message.sender_type === 'admin'
                      ? 'bg-indigo-50 ml-8'
                      : 'bg-gray-50 mr-8'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                      message.sender_type === 'admin'
                        ? 'bg-indigo-200'
                        : 'bg-gray-200'
                    }`}>
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{message.sender_name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{message.message}</p>
                </div>
              ))}
            </div>

            {/* Reply Input */}
            {selectedTicket.status !== 'closed' && (
              <div className="border-t border-gray-200 pt-4">
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply..."
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSendReply}
                    disabled={!replyMessage.trim()}
                    className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Reply
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a ticket to view details
          </div>
        )}
      </div>
    </div>
  );
}
