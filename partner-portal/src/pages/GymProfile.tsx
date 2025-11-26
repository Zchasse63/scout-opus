import React, { useState, useEffect } from 'react';
import { Save, Upload, X, Plus, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Gym, GymHours, Amenity, GymAmenity } from '../types';

export default function GymProfile() {
  const { partner } = useAuthStore();
  const [gym, setGym] = useState<Gym | null>(null);
  const [hours, setHours] = useState<GymHours[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    loadGymData();
    loadAmenities();
  }, [partner]);

  const loadGymData = async () => {
    if (!partner) return;

    try {
      setLoading(true);

      // Load gym
      const { data: gymData, error: gymError } = await supabase
        .from('gyms')
        .select('*')
        .eq('owner_id', partner.id)
        .single();

      if (gymError) throw gymError;
      setGym(gymData);

      // Load hours
      const { data: hoursData, error: hoursError } = await supabase
        .from('gym_hours')
        .select('*')
        .eq('gym_id', gymData.id)
        .order('day_of_week');

      if (hoursError) throw hoursError;

      // Initialize hours if empty
      if (!hoursData || hoursData.length === 0) {
        const defaultHours = Array.from({ length: 7 }, (_, i) => ({
          gym_id: gymData.id,
          day_of_week: i,
          opens_at: '06:00',
          closes_at: '22:00',
          is_closed: false,
        }));
        setHours(defaultHours as GymHours[]);
      } else {
        setHours(hoursData);
      }

      // Load gym amenities
      const { data: gymAmenitiesData } = await supabase
        .from('gym_amenities')
        .select('amenity_id')
        .eq('gym_id', gymData.id);

      if (gymAmenitiesData) {
        setSelectedAmenities(gymAmenitiesData.map((a: any) => a.amenity_id));
      }

      // Load photos
      const { data: photosData } = await supabase
        .from('gym_photos')
        .select('*')
        .eq('gym_id', gymData.id)
        .order('display_order');

      if (photosData) {
        setPhotos(photosData);
      }
    } catch (error) {
      console.error('Error loading gym data:', error);
      alert('Failed to load gym data');
    } finally {
      setLoading(false);
    }
  };

  const loadAmenities = async () => {
    const { data, error } = await supabase
      .from('amenities')
      .select('*')
      .order('name');

    if (data) {
      setAmenities(data);
    }
  };

  const handleSave = async () => {
    if (!gym) return;

    try {
      setSaving(true);

      // Update gym basic info
      const { error: gymError } = await supabase
        .from('gyms')
        .update({
          name: gym.name,
          description: gym.description,
          phone: gym.phone,
          website: gym.website,
          day_pass_price: gym.day_pass_price,
          week_pass_price: gym.week_pass_price,
          month_pass_price: gym.month_pass_price,
          updated_at: new Date().toISOString(),
        })
        .eq('id', gym.id);

      if (gymError) throw gymError;

      // Update or insert hours
      for (const hour of hours) {
        const { error: hourError } = await supabase
          .from('gym_hours')
          .upsert({
            gym_id: gym.id,
            day_of_week: hour.day_of_week,
            opens_at: hour.is_closed ? null : hour.opens_at,
            closes_at: hour.is_closed ? null : hour.closes_at,
            is_closed: hour.is_closed,
          }, {
            onConflict: 'gym_id,day_of_week',
          });

        if (hourError) throw hourError;
      }

      // Update amenities
      // First, delete all existing
      await supabase
        .from('gym_amenities')
        .delete()
        .eq('gym_id', gym.id);

      // Then insert selected
      if (selectedAmenities.length > 0) {
        const amenitiesData = selectedAmenities.map((amenity_id) => ({
          gym_id: gym.id,
          amenity_id,
        }));

        await supabase
          .from('gym_amenities')
          .insert(amenitiesData);
      }

      alert('Gym profile updated successfully!');
    } catch (error) {
      console.error('Error saving gym:', error);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const toggleAmenity = (amenityId: number) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const updateHour = (dayOfWeek: number, field: string, value: any) => {
    setHours((prev) =>
      prev.map((h) =>
        h.day_of_week === dayOfWeek ? { ...h, [field]: value } : h
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!gym) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-gray-600">No gym found. Please contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gym Profile</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gym Name
                </label>
                <input
                  type="text"
                  value={gym.name}
                  onChange={(e) => setGym({ ...gym, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={gym.description || ''}
                  onChange={(e) => setGym({ ...gym, description: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={gym.phone || ''}
                    onChange={(e) => setGym({ ...gym, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={gym.website || ''}
                    onChange={(e) => setGym({ ...gym, website: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Pass Pricing</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Day Pass ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={gym.day_pass_price || ''}
                  onChange={(e) =>
                    setGym({ ...gym, day_pass_price: parseFloat(e.target.value) })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Week Pass ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={gym.week_pass_price || ''}
                  onChange={(e) =>
                    setGym({ ...gym, week_pass_price: parseFloat(e.target.value) })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Month Pass ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={gym.month_pass_price || ''}
                  onChange={(e) =>
                    setGym({ ...gym, month_pass_price: parseFloat(e.target.value) })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Operating Hours</h2>
            <div className="space-y-3">
              {hours.map((hour) => (
                <div key={hour.day_of_week} className="flex items-center gap-4">
                  <div className="w-24 font-medium text-gray-700">
                    {daysOfWeek[hour.day_of_week]}
                  </div>

                  <input
                    type="checkbox"
                    checked={!hour.is_closed}
                    onChange={(e) =>
                      updateHour(hour.day_of_week, 'is_closed', !e.target.checked)
                    }
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-gray-600">Open</span>

                  {!hour.is_closed && (
                    <>
                      <input
                        type="time"
                        value={hour.opens_at || ''}
                        onChange={(e) =>
                          updateHour(hour.day_of_week, 'opens_at', e.target.value)
                        }
                        className="border border-gray-300 rounded-md px-3 py-1"
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={hour.closes_at || ''}
                        onChange={(e) =>
                          updateHour(hour.day_of_week, 'closes_at', e.target.value)
                        }
                        className="border border-gray-300 rounded-md px-3 py-1"
                      />
                    </>
                  )}

                  {hour.is_closed && (
                    <span className="text-red-600 text-sm">Closed</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {amenities.map((amenity) => (
                <label
                  key={amenity.id}
                  className="flex items-center gap-2 p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity.id)}
                    onChange={() => toggleAmenity(amenity.id)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">
                    {amenity.icon} {amenity.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Photos Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Photos</h2>
            <p className="text-sm text-gray-600 mb-4">
              Photo management coming soon. Contact support to update your gym photos.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative">
                  <img
                    src={photo.url}
                    alt="Gym"
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
