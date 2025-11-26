import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, MapPin } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';
import { AnalyticsData } from '../types';

export default function Analytics() {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [userGrowth, setUserGrowth] = useState<any[]>([]);
  const [bookingTrends, setBookingTrends] = useState<any[]>([]);
  const [topGyms, setTopGyms] = useState<any[]>([]);
  const [geoDistribution, setGeoDistribution] = useState<any[]>([]);
  const [searchVsBooking, setSearchVsBooking] = useState({ searches: 0, bookings: 0, conversion: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      const daysAgo = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      // User Growth Data
      const growthData = [];
      for (let i = daysAgo - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(date.setHours(23, 59, 59, 999)).toISOString();

        const { count: newUsers } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startOfDay)
          .lte('created_at', endOfDay);

        const { count: newBookings } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startOfDay)
          .lte('created_at', endOfDay);

        const { data: revenue } = await supabase
          .from('bookings')
          .select('platform_fee')
          .gte('created_at', startOfDay)
          .lte('created_at', endOfDay);

        const dailyRevenue = revenue?.reduce((sum, b) => sum + (b.platform_fee || 0), 0) || 0;

        growthData.push({
          date: new Date(startOfDay).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          users: newUsers || 0,
          bookings: newBookings || 0,
          revenue: dailyRevenue,
        });
      }
      setUserGrowth(growthData);

      // Booking Trends
      const hourlyBookings = Array(24).fill(0);
      const { data: allBookings } = await supabase
        .from('bookings')
        .select('created_at')
        .gte('created_at', startDate.toISOString());

      allBookings?.forEach((booking) => {
        const hour = new Date(booking.created_at).getHours();
        hourlyBookings[hour]++;
      });

      const bookingData = hourlyBookings.map((count, hour) => ({
        hour: hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`,
        bookings: count,
      }));
      setBookingTrends(bookingData.filter((d) => d.bookings > 0));

      // Top Gyms
      const { data: gymsWithBookings } = await supabase
        .from('bookings')
        .select('gym_id, gyms(name, city)')
        .gte('created_at', startDate.toISOString());

      const gymCounts: { [key: number]: { name: string; city: string; bookings: number } } = {};
      gymsWithBookings?.forEach((booking: any) => {
        const gymId = booking.gym_id;
        if (!gymCounts[gymId]) {
          gymCounts[gymId] = {
            name: booking.gyms?.name || 'Unknown',
            city: booking.gyms?.city || 'Unknown',
            bookings: 0,
          };
        }
        gymCounts[gymId].bookings++;
      });

      const topGymsData = Object.values(gymCounts)
        .sort((a, b) => b.bookings - a.bookings)
        .slice(0, 5);

      setTopGyms(topGymsData);

      // Geographic Distribution
      const { data: gyms } = await supabase
        .from('gyms')
        .select('state');

      const stateCounts: { [key: string]: number } = {};
      gyms?.forEach((gym) => {
        stateCounts[gym.state] = (stateCounts[gym.state] || 0) + 1;
      });

      const geoData = Object.entries(stateCounts)
        .map(([state, count]) => ({ state, gyms: count }))
        .sort((a, b) => b.gyms - a.gyms)
        .slice(0, 10);

      setGeoDistribution(geoData);

      // Search vs Booking Conversion
      const { count: totalSearches } = await supabase
        .from('voice_queries')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString());

      const { count: totalBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString());

      const conversion = totalSearches > 0 ? (totalBookings / totalSearches) * 100 : 0;

      setSearchVsBooking({
        searches: totalSearches || 0,
        bookings: totalBookings || 0,
        conversion: Math.round(conversion * 10) / 10,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
          <p className="text-gray-600 mt-1">In-depth insights and trends</p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range as any)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                dateRange === range
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Searches</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{searchVsBooking.searches}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{searchVsBooking.bookings}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{searchVsBooking.conversion}%</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User & Booking Growth */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">User & Booking Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#4F46E5" strokeWidth={2} name="New Users" />
              <Line type="monotone" dataKey="bookings" stroke="#10B981" strokeWidth={2} name="Bookings" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Line type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={2} name="Platform Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Gyms */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Top Performing Gyms</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topGyms} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Geographic Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={geoDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="gyms" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
