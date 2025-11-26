import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Calendar,
  DollarSign,
  QrCode,
  CreditCard,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { partner, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Gym Profile', href: '/profile', icon: Building2 },
    { name: 'Bookings', href: '/bookings', icon: Calendar },
    { name: 'Financials', href: '/financials', icon: DollarSign },
    { name: 'QR Scanner', href: '/scanner', icon: QrCode },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-2xl font-bold text-indigo-600">Scout Partner</h1>
            </div>

            {partner && (
              <div className="mt-5 px-4">
                <div className="rounded-lg bg-indigo-50 p-3">
                  <p className="text-sm font-medium text-gray-900">{partner.business_name}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {partner.stripe_onboarding_complete ? (
                      <span className="text-green-600">✓ Stripe Connected</span>
                    ) : (
                      <Link to="/stripe-onboarding" className="text-indigo-600 hover:underline">
                        Complete Stripe Setup
                      </Link>
                    )}
                  </p>
                </div>
              </div>
            )}

            <nav className="mt-5 flex-1 space-y-1 px-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive(item.href)
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        isActive(item.href) ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow md:hidden">
        <button
          type="button"
          className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Open sidebar</span>
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
        <div className="flex flex-1 justify-between px-4">
          <div className="flex flex-1 items-center">
            <h1 className="text-xl font-bold text-indigo-600">Scout Partner</h1>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
            <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
              <div className="flex flex-shrink-0 items-center px-4">
                <h1 className="text-2xl font-bold text-indigo-600">Scout Partner</h1>
              </div>

              {partner && (
                <div className="mt-5 px-4">
                  <div className="rounded-lg bg-indigo-50 p-3">
                    <p className="text-sm font-medium text-gray-900">{partner.business_name}</p>
                  </div>
                </div>
              )}

              <nav className="mt-5 space-y-1 px-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        isActive(item.href)
                          ? 'bg-indigo-100 text-indigo-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="mr-4 h-6 w-6" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="group flex w-full items-center px-2 py-2 text-base font-medium text-gray-600 rounded-md hover:bg-gray-50"
              >
                <LogOut className="mr-4 h-6 w-6" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:pl-64">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
