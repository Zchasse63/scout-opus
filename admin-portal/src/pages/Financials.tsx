import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Download, CreditCard } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';

export default function Financials() {
  const [dateRange, setDateRange] = useState<'30d' | '90d' | 'all'>('30d');
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    gross_revenue: 0,
    platform_fees: 0,
    partner_payouts: 0,
    refunds: 0,
  });
  const [revenueByPartner, setRevenueByPartner] = useState<any[]>([]);
  const [revenueByPassType, setRevenueByPassType] = useState<any[]>([]);
  const [revenueOverTime, setRevenueOverTime] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    loadFinancials();
  }, [dateRange]);

  const loadFinancials = async () => {
    try {
      setLoading(true);

      const daysAgo = dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 365 * 10;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      // Get all bookings for the period
      const { data: bookings } = await supabase
        .from('bookings')
        .select(`
          *,
          gym:gyms(name, owner_id, owner:partners(business_name))
        `)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (!bookings) return;

      // Calculate summary
      const grossRevenue = bookings.reduce((sum, b) => sum + (b.amount_paid || 0), 0);
      const platformFees = bookings.reduce((sum, b) => sum + (b.platform_fee || 0), 0);
      const partnerPayouts = bookings.reduce((sum, b) => sum + (b.gym_payout || 0), 0);
      const refundedBookings = bookings.filter((b) => b.status === 'cancelled');
      const refunds = refundedBookings.reduce((sum, b) => sum + (b.amount_paid || 0), 0);

      setSummary({
        gross_revenue: grossRevenue,
        platform_fees: platformFees,
        partner_payouts: partnerPayouts,
        refunds: refunds,
      });

      // Revenue by partner (top 5)
      const partnerRevenue: { [key: string]: { name: string; revenue: number } } = {};
      bookings.forEach((booking: any) => {
        const partnerName = booking.gym?.owner?.business_name || 'Unknown';
        if (!partnerRevenue[partnerName]) {
          partnerRevenue[partnerName] = { name: partnerName, revenue: 0 };
        }
        partnerRevenue[partnerName].revenue += booking.platform_fee || 0;
      });

      const topPartners = Object.values(partnerRevenue)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
      setRevenueByPartner(topPartners);

      // Revenue by pass type
      const passTypeRevenue: { [key: string]: number } = { day: 0, week: 0, month: 0 };
      bookings.forEach((booking) => {
        passTypeRevenue[booking.pass_type] += booking.platform_fee || 0;
      });

      setRevenueByPassType([
        { name: 'Day Pass', value: passTypeRevenue.day },
        { name: 'Week Pass', value: passTypeRevenue.week },
        { name: 'Month Pass', value: passTypeRevenue.month },
      ]);

      // Revenue over time (last 30 days)
      const revenueData = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(date.setHours(23, 59, 59, 999)).toISOString();

        const dailyBookings = bookings.filter(
          (b) => new Date(b.created_at) >= new Date(startOfDay) &&
                 new Date(b.created_at) <= new Date(endOfDay)
        );

        const dailyRevenue = dailyBookings.reduce((sum, b) => sum + (b.platform_fee || 0), 0);

        revenueData.push({
          date: new Date(startOfDay).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: dailyRevenue,
        });
      }
      setRevenueOverTime(revenueData);

      // Recent transactions
      setTransactions(bookings.slice(0, 20));
    } catch (error) {
      console.error('Error loading financials:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Partner', 'Gym', 'Amount', 'Platform Fee', 'Partner Payout', 'Pass Type', 'Status'];
    const rows = transactions.map((t: any) => [
      new Date(t.created_at).toLocaleDateString(),
      t.gym?.owner?.business_name || 'Unknown',
      t.gym?.name || 'Unknown',
      `$${t.amount_paid.toFixed(2)}`,
      `$${t.platform_fee.toFixed(2)}`,
      `$${t.gym_payout.toFixed(2)}`,
      t.pass_type,
      t.status,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scout-platform-financials-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Financials</h1>
          <p className="text-gray-600 mt-1">Track revenue and financial metrics</p>
        </div>
        <div className="flex gap-2">
          {['30d', '90d', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range as any)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                dateRange === range
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {range === 'all' ? 'All Time' : range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Gross Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${summary.gross_revenue.toFixed(2)}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Platform Fees</p>
              <p className="text-2xl font-bold text-green-600 mt-1">${summary.platform_fees.toFixed(2)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">15% platform fee</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Partner Payouts</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">${summary.partner_payouts.toFixed(2)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">85% to partners</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Refunds</p>
              <p className="text-2xl font-bold text-red-600 mt-1">${summary.refunds.toFixed(2)}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Over Time */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Platform Revenue (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Pass Type */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue by Pass Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueByPassType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} $${value.toFixed(0)}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueByPassType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Partners */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Revenue by Partner (Top 5)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={revenueByPartner}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value}`} />
            <Bar dataKey="revenue" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <button
            onClick={exportToCSV}
            className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gym</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partner Payout</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((transaction: any) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.gym?.owner?.business_name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.gym?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${transaction.amount_paid.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${transaction.platform_fee.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${transaction.gym_payout.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.status === 'used'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'confirmed'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
