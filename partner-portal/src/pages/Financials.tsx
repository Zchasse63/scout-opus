import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Download, Loader2, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { FinancialSummary, Transaction, RevenueData } from '../types';

export default function Financials() {
  const { partner } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<FinancialSummary>({
    total_revenue: 0,
    total_payouts: 0,
    pending_payouts: 0,
    platform_fees_paid: 0,
    bookings_count: 0,
  });
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    loadFinancialData();
  }, [partner, dateRange]);

  const loadFinancialData = async () => {
    if (!partner) return;

    try {
      setLoading(true);

      // Get gym ID
      const { data: gymData } = await supabase
        .from('gyms')
        .select('id')
        .eq('owner_id', partner.id)
        .single();

      if (!gymData) return;

      // Calculate date range
      const startDate = getStartDate();

      // Load bookings for the period
      const { data: bookingsData, error } = await supabase
        .from('bookings')
        .select(`
          *,
          user:users(first_name, last_name, email)
        `)
        .eq('gym_id', gymData.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (bookingsData) {
        // Calculate summary
        const totalRevenue = bookingsData.reduce((sum, b) => sum + b.gym_payout, 0);
        const platformFees = bookingsData.reduce((sum, b) => sum + b.platform_fee, 0);
        const usedBookings = bookingsData.filter((b) => b.status === 'used');
        const confirmedBookings = bookingsData.filter((b) => b.status === 'confirmed');

        setSummary({
          total_revenue: totalRevenue,
          total_payouts: usedBookings.reduce((sum, b) => sum + b.gym_payout, 0),
          pending_payouts: confirmedBookings.reduce((sum, b) => sum + b.gym_payout, 0),
          platform_fees_paid: platformFees,
          bookings_count: bookingsData.length,
        });

        // Generate revenue chart data (daily)
        const revenueByDate: { [key: string]: { revenue: number; bookings: number } } = {};

        bookingsData.forEach((booking) => {
          const date = new Date(booking.created_at).toISOString().split('T')[0];
          if (!revenueByDate[date]) {
            revenueByDate[date] = { revenue: 0, bookings: 0 };
          }
          revenueByDate[date].revenue += booking.gym_payout;
          revenueByDate[date].bookings += 1;
        });

        const chartData = Object.entries(revenueByDate)
          .map(([date, data]) => ({
            date,
            revenue: data.revenue,
            bookings: data.bookings,
          }))
          .sort((a, b) => a.date.localeCompare(b.date));

        setRevenueData(chartData);

        // Format transactions
        const transactionsData = bookingsData.map((booking) => ({
          id: booking.id,
          booking_id: booking.id,
          date: booking.created_at,
          customer_name: `${booking.user?.first_name || ''} ${booking.user?.last_name || ''}`.trim() || 'Unknown',
          customer_email: booking.user?.email || '',
          amount: booking.amount_paid,
          fee: booking.platform_fee,
          net: booking.gym_payout,
          status: booking.status,
          pass_type: booking.pass_type,
        }));

        setTransactions(transactionsData);
      }
    } catch (error) {
      console.error('Error loading financial data:', error);
      alert('Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  const getStartDate = () => {
    const now = new Date();
    switch (dateRange) {
      case '7d':
        return new Date(now.setDate(now.getDate() - 7));
      case '30d':
        return new Date(now.setDate(now.getDate() - 30));
      case '90d':
        return new Date(now.setDate(now.getDate() - 90));
      case 'all':
      default:
        return new Date(2020, 0, 1); // Way back
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Customer', 'Email', 'Pass Type', 'Amount', 'Fee', 'Net', 'Status'];
    const rows = transactions.map((t) => [
      new Date(t.date).toLocaleDateString(),
      t.customer_name,
      t.customer_email,
      t.pass_type,
      `$${t.amount.toFixed(2)}`,
      `$${t.fee.toFixed(2)}`,
      `$${t.net.toFixed(2)}`,
      t.status,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scout-financials-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financials</h1>
          <p className="text-gray-600 mt-1">Track your revenue and payouts</p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d', 'all'].map((range) => (
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
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${summary.total_revenue.toFixed(2)}
              </p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">{summary.bookings_count} bookings</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paid Out</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                ${summary.total_payouts.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">From completed bookings</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Payouts</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                ${summary.pending_payouts.toFixed(2)}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Awaiting check-in</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Platform Fees</p>
              <p className="text-2xl font-bold text-gray-600 mt-1">
                ${summary.platform_fees_paid.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">15% platform fee</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Revenue Over Time</h2>
        {revenueData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip
                formatter={(value: any) => `$${value.toFixed(2)}`}
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-gray-500">No revenue data for this period</div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Transaction History</h2>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pass Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net</th>
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
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{transaction.customer_name}</div>
                      <div className="text-xs text-gray-500">{transaction.customer_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {transaction.pass_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      ${transaction.fee.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${transaction.net.toFixed(2)}
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

      {/* Stripe Onboarding Notice */}
      {!partner?.stripe_onboarding_complete && (
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            <strong>Stripe Setup Required:</strong> Complete your Stripe Connect onboarding to receive payouts.{' '}
            <a href="/stripe-onboarding" className="underline font-medium">
              Complete Setup
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
