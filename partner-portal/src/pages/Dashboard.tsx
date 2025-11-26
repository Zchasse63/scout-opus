import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  Star
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

interface DashboardStats {
  totalRevenue: number;
  totalBookings: number;
  activeBookings: number;
  averageRating: number;
  revenueGrowth: number;
  bookingsGrowth: number;
}

export default function Dashboard() {
  const { partner } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalBookings: 0,
    activeBookings: 0,
    averageRating: 0,
    revenueGrowth: 0,
    bookingsGrowth: 0,
  });
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (partner) {
      loadDashboardData();
    }
  }, [partner]);

  const loadDashboardData = async () => {
    if (!partner) return;

    try {
      // Get gym ID
      const { data: gymData } = await supabase
        .from('gyms')
        .select('id, rating')
        .eq('owner_id', partner.id)
        .single();

      if (!gymData) return;

      // Get all bookings for stats
      const { data: allBookings } = await supabase
        .from('bookings')
        .select('gym_payout, created_at, status')
        .eq('gym_id', gymData.id);

      // Calculate stats
      const totalRevenue = allBookings?.reduce((sum, b) => sum + (b.gym_payout || 0), 0) || 0;
      const totalBookings = allBookings?.length || 0;
      const activeBookings = allBookings?.filter(b => b.status === 'confirmed').length || 0;

      // Calculate growth (compare last 30 days vs previous 30 days)
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      const sixtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

      const recentBookings = allBookings?.filter(b => new Date(b.created_at) >= thirtyDaysAgo) || [];
      const previousBookings = allBookings?.filter(b =>
        new Date(b.created_at) >= sixtyDaysAgo && new Date(b.created_at) < thirtyDaysAgo
      ) || [];

      const recentRevenue = recentBookings.reduce((sum, b) => sum + (b.gym_payout || 0), 0);
      const previousRevenue = previousBookings.reduce((sum, b) => sum + (b.gym_payout || 0), 0);

      const revenueGrowth = previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
      const bookingsGrowth = previousBookings.length > 0
        ? ((recentBookings.length - previousBookings.length) / previousBookings.length) * 100
        : 0;

      setStats({
        totalRevenue,
        totalBookings,
        activeBookings,
        averageRating: gymData.rating || 0,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
        bookingsGrowth: Math.round(bookingsGrowth * 10) / 10,
      });

      // Generate revenue chart data (last 6 months)
      const monthlyRevenue: { [key: string]: number } = {};
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = months[date.getMonth()];
        monthlyRevenue[monthKey] = 0;
      }

      allBookings?.forEach(booking => {
        const date = new Date(booking.created_at);
        const monthKey = months[date.getMonth()];
        if (monthKey in monthlyRevenue) {
          monthlyRevenue[monthKey] += booking.gym_payout || 0;
        }
      });

      setRevenueData(
        Object.entries(monthlyRevenue).map(([date, revenue]) => ({
          date,
          revenue,
        }))
      );

      // Get recent bookings
      const { data: recentData } = await supabase
        .from('bookings')
        .select(`
          id,
          pass_type,
          gym_payout,
          status,
          created_at,
          user:users(first_name, last_name)
        `)
        .eq('gym_id', gymData.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentBookings(recentData || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, growth, prefix = '', suffix = '' }: any) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
        {growth !== undefined && (
          <span className={`text-sm font-semibold ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {growth >= 0 ? '+' : ''}{growth}%
          </span>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your gym's performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={DollarSign}
          title="Total Revenue"
          value={stats.totalRevenue}
          growth={stats.revenueGrowth}
          prefix="$"
        />
        <StatCard
          icon={Calendar}
          title="Total Bookings"
          value={stats.totalBookings}
          growth={stats.bookingsGrowth}
        />
        <StatCard
          icon={Clock}
          title="Active Bookings"
          value={stats.activeBookings}
        />
        <StatCard
          icon={Star}
          title="Average Rating"
          value={stats.averageRating.toFixed(1)}
          suffix="/5.0"
        />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Revenue Overview</h2>
          <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
            <option>Last 6 months</option>
            <option>Last 3 months</option>
            <option>Last month</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ fill: '#6366f1' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentBookings.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No bookings yet
            </div>
          ) : (
            recentBookings.map((booking: any) => (
              <div key={booking.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.user?.first_name || ''} {booking.user?.last_name || ''}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">
                      {booking.pass_type} Pass • {new Date(booking.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${booking.gym_payout.toFixed(2)}</p>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                    booking.status === 'confirmed'
                      ? 'text-yellow-700 bg-yellow-100'
                      : booking.status === 'used'
                      ? 'text-green-700 bg-green-100'
                      : 'text-red-700 bg-red-100'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
