import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { CheckCircle, XCircle, Scan, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ScanResult {
  success: boolean;
  message: string;
  booking?: {
    id: string;
    userName: string;
    passType: string;
    bookingDate: string;
    status: string;
  };
}

export default function QRScanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  const startScanning = () => {
    setResult(null);
    setScanning(true);

    // Initialize QR code scanner
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      false
    );

    scanner.render(onScanSuccess, onScanError);
    scannerRef.current = scanner;
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const onScanSuccess = async (decodedText: string) => {
    console.log('QR Code detected:', decodedText);
    stopScanning();
    await verifyPass(decodedText);
  };

  const onScanError = (error: any) => {
    // Ignore scan errors (they happen continuously)
    // console.warn('Scan error:', error);
  };

  const verifyPass = async (qrData: string) => {
    setLoading(true);

    try {
      // Parse QR code data
      const passData = JSON.parse(qrData);
      const { booking_id, user_id, gym_id } = passData;

      if (!booking_id) {
        throw new Error('Invalid QR code');
      }

      // Verify booking in database
      const { data: booking, error } = await supabase
        .from('bookings')
        .select(`
          id,
          status,
          booking_date,
          pass_type,
          user:users(name, email)
        `)
        .eq('id', booking_id)
        .single();

      if (error || !booking) {
        setResult({
          success: false,
          message: 'Booking not found',
        });
        return;
      }

      // Check if booking is valid
      if (booking.status === 'used') {
        setResult({
          success: false,
          message: 'This pass has already been used',
          booking: {
            id: booking.id,
            userName: booking.user.name,
            passType: booking.pass_type,
            bookingDate: booking.booking_date,
            status: booking.status,
          },
        });
        return;
      }

      if (booking.status === 'cancelled') {
        setResult({
          success: false,
          message: 'This booking has been cancelled',
          booking: {
            id: booking.id,
            userName: booking.user.name,
            passType: booking.pass_type,
            bookingDate: booking.booking_date,
            status: booking.status,
          },
        });
        return;
      }

      // Check if booking date is valid (within range)
      const bookingDate = new Date(booking.booking_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (bookingDate < today) {
        setResult({
          success: false,
          message: 'This pass has expired',
          booking: {
            id: booking.id,
            userName: booking.user.name,
            passType: booking.pass_type,
            bookingDate: booking.booking_date,
            status: booking.status,
          },
        });
        return;
      }

      // Mark pass as used
      await supabase
        .from('bookings')
        .update({
          status: 'used',
          checked_in_at: new Date().toISOString(),
        })
        .eq('id', booking_id);

      setResult({
        success: true,
        message: 'Pass verified successfully!',
        booking: {
          id: booking.id,
          userName: booking.user.name,
          passType: booking.pass_type,
          bookingDate: booking.booking_date,
          status: 'used',
        },
      });
    } catch (error) {
      console.error('Error verifying pass:', error);
      setResult({
        success: false,
        message: 'Invalid QR code or verification failed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">QR Code Scanner</h1>
        <p className="text-gray-600 mt-1">Scan customer passes for check-in</p>
      </div>

      {/* Scanner Container */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        {!scanning && !result && (
          <div className="text-center py-12">
            <Scan className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Ready to Scan
            </h3>
            <p className="text-gray-600 mb-6">
              Ask the customer to open their pass in the Scout app
            </p>
            <button
              onClick={startScanning}
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-semibold"
            >
              Start Scanning
            </button>
          </div>
        )}

        {scanning && (
          <div>
            <div id="qr-reader" className="mb-4"></div>
            <button
              onClick={stopScanning}
              className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Verifying pass...</p>
          </div>
        )}

        {result && (
          <div className="py-8">
            <div className={`flex items-center justify-center mb-6`}>
              {result.success ? (
                <CheckCircle className="w-20 h-20 text-green-500" />
              ) : (
                <XCircle className="w-20 h-20 text-red-500" />
              )}
            </div>

            <div className={`text-center mb-6 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
              <h3 className="text-2xl font-bold mb-2">
                {result.success ? 'Valid Pass' : 'Invalid Pass'}
              </h3>
              <p className="text-lg">{result.message}</p>
            </div>

            {result.booking && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Customer</p>
                    <p className="font-semibold">{result.booking.userName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Pass Type</p>
                    <p className="font-semibold capitalize">{result.booking.passType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Booking Date</p>
                    <p className="font-semibold">
                      {new Date(result.booking.bookingDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Booking ID</p>
                    <p className="font-semibold">#{result.booking.id.slice(0, 8)}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setResult(null);
                startScanning();
              }}
              className="w-full bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 font-semibold"
            >
              Scan Another Pass
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p className="font-semibold mb-1">Scanning Tips:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Ensure good lighting</li>
              <li>Hold camera steady</li>
              <li>Keep QR code within the frame</li>
              <li>Ask customer to increase screen brightness</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
