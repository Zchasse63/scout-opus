import React, { useState, useEffect } from 'react';
import { Users, Building2, DollarSign, MessageCircle, TrendingUp, AlertCircle } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '../lib/supabase';
import { PlatformStats, ActivityItem } from '../types';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const [stats, setStats] = useState<PlatformStats>({
    total_users: 0,
    users_growth: 0,
    active_partners: 0,
    partners_growth: 0,
    monthly_revenue: 0,
    revenue_growth: 0,
    open_tickets: 0,
    tickets_growth: 0,
  });
  const [userSignups, setUserSignups] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [bookingsByType, setBookingsByType] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Get total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get users from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: recentUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Get users from previous 30 days (for growth calculation)
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const { count: previousUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', thirtyDaysAgo.toISOString());

      const usersGrowth = previousUsers ? ((recentUsers - previousUsers) / previousUsers) * 100 : 0;

      // Get active partners
      const { count: activePartners } = await supabase
        .from('partners')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get this month's revenue
      const firstOfMonth = new Date();
      firstOfMonth.setDate(1);
      firstOfMonth.setHours(0, 0, 0, 0);

      const { data: monthlyBookings } = await supabase
        .from('bookings')
        .select('platform_fee')
        .gte('created_at', firstOfMonth.toISOString());

      const monthlyRevenue = monthlyBookings?.reduce((sum, b) => sum + (b.platform_fee || 0), 0) || 0;

      // Get open support tickets
      const { count: openTickets } = await supabase
        .from('support_tickets')
        .select('*', { count: 'exact', head: true })
        .in('status', ['open', 'in_progress']);

      setStats({
        total_users: totalUsers || 0,
        users_growth: Math.round(usersGrowth * 10) / 10,
        active_partners: activePartners || 0,
        partners_growth: 0, // Calculate if needed
        monthly_revenue: monthlyRevenue,
        revenue_growth: 0, // Calculate if needed
        open_tickets: openTickets || 0,
        tickets_growth: 0, // Calculate if needed
      });

      // Generate user signup chart data (last 7 days)
      const signupsData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(date.setHours(23, 59, 59, 999)).toISOString();

        const { count } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startOfDay)
          .lte('created_at', endOfDay);

        signupsData.push({
          date: new Date(startOfDay).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          users: count || 0,
        });
      }
      setUserSignups(signupsData);

      // Generate revenue data (last 7 days)
      const revenueChartData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(date.setHours(23, 59, 59, 999)).toISOString();

        const { data: dailyBookings } = await supabase
          .from('bookings')
          .select('platform_fee')
          .gte('created_at', startOfDay)
          .lte('created_at', endOfDay);

        const dailyRevenue = dailyBookings?.reduce((sum, b) => sum + (b.platform_fee || 0), 0) || 0;

        revenueChartData.push({
          date: new Date(startOfDay).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: dailyRevenue,
        });
      }
      setRevenueData(revenueChartData);

      // Get bookings by pass type
      const { data: allBookings } = await supabase
        .from('bookings')
        .select('pass_type')
        .gte('created_at', thirtyDaysAgo.toISOString());

      const passTypeCounts = { day: 0, week: 0, month: 0 };
      allBookings?.forEach((b) => {
        passTypeCounts[b.pass_type] = (passTypeCounts[b.pass_type] || 0) + 1;
      });

      setBookingsByType([
        { name: 'Day Pass', value: passTypeCounts.day },
        { name: 'Week Pass', value: passTypeCounts.week },
        { name: 'Month Pass', value: passTypeCounts.month },
      ]);

      // Get recent activity
      const activity: ActivityItem[] = [];

      // Get recent partner applications
      const { data: applications } = await supabase
        .from('partner_applications')
        .select('*')
        .eq('status', 'pending')
        .order('submitted_at', { ascending: false })
        .limit(3);

      applications?.forEach((app) => {
        activity.push({
          id: app.id,
          type: 'partner_application',
          title: 'New Partner Application',
          description: `${app.gym_name} applied to become a partner`,
          created_at: app.submitted_at,
          priority: 'normal',
        });
      });

      // Get recent support tickets
      const { data: tickets } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(3);

      tickets?.forEach((ticket) => {
        activity.push({
          id: ticket.id,
          type: 'support_ticket',
          title: 'New Support Ticket',
          description: ticket.subject,
          created_at: ticket.created_at,
          priority: ticket.priority,
        });
      });

      // Sort by most recent
      activity.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setRecentActivity(activity.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Platform Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of Scout Fitness platform metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_users.toLocaleString()}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">+{stats.users_growth}% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Partners</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.active_partners}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Verified gym partners</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${stats.monthly_revenue.toFixed(2)}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Platform fees earned</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Tickets</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.open_tickets}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <MessageCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Requires attention</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Signups */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">User Signups (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={userSignups}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="users" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Platform Revenue (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Bar dataKey="revenue" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bookings by Type */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Bookings by Pass Type</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={bookingsByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {bookingsByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No recent activity</p>
            ) : (
              recentActivity.map((item) => (
                <div key={item.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full mr-3 ${
                    item.type === 'partner_application' ? 'bg-blue-100' :
                    item.type === 'support_ticket' ? 'bg-red-100' :
                    'bg-gray-100'
                  }`}>
                    {item.type === 'partner_application' && <Building2 className="w-4 h-4 text-blue-600" />}
                    {item.type === 'support_ticket' && <MessageCircle className="w-4 h-4 text-red-600" />}
                    {item.type === 'content_moderation' && <AlertCircle className="w-4 h-4 text-gray-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-gray-600">{item.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
