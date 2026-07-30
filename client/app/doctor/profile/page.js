'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function DoctorProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    specialization: '',
    qualifications: '',
    experience: '',
    consultationFee: '',
    availableDays: '',
    timeSlots: '',
    bio: '',
  });

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchAPI('/doctors/profile')
        .then((res) => {
          const profile = res.data || res;
          if (profile) {
            setFormData({
              specialization: profile.specialization || '',
              qualifications: profile.qualifications || '',
              experience: profile.experienceYears || profile.experience || '',
              consultationFee: profile.consultationFee || profile.fees || profile.fee || '',
              availableDays: Array.isArray(profile.availableDays)
                ? profile.availableDays.join(', ')
                : profile.availableDays || '',
              timeSlots: Array.isArray(profile.availableSlots || profile.timeSlots)
                ? (profile.availableSlots || profile.timeSlots).join(', ')
                : profile.availableSlots || profile.timeSlots || '',
              bio: profile.bio || '',
            });
          }
        })
        .catch((err) => {
          console.log('No existing profile found yet:', err);
        })
        .finally(() => setLoadingProfile(false));
    }
  }, [user, loading, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    const expValue = Number(formData.experience) || 0;
    const feeValue = Number(formData.consultationFee) || 0;

    const payload = {
      specialization: formData.specialization,
      qualifications: formData.qualifications,
      experienceYears: expValue,
      experience: expValue,
      consultationFee: feeValue,
      fees: feeValue,
      fee: feeValue,
      availableDays: formData.availableDays.split(',').map((s) => s.trim()).filter(Boolean),
      availableSlots: formData.timeSlots.split(',').map((s) => s.trim()).filter(Boolean),
      timeSlots: formData.timeSlots.split(',').map((s) => s.trim()).filter(Boolean),
      bio: formData.bio,
    };

    try {
      await fetchAPI('/doctors/profile', {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setMessage({ type: 'success', text: 'Doctor profile updated successfully!' });
    } catch (err) {
      try {
        await fetchAPI('/doctors/profile', {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setMessage({ type: 'success', text: 'Doctor profile saved successfully!' });
      } catch (postErr) {
        setMessage({
          type: 'error',
          text: postErr.message || 'Failed to update doctor profile',
        });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingProfile) {
    return <div className="p-8 text-center">Loading profile settings...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold mb-6">Doctor Profile Settings</h1>

        {message.text && (
          <div
          className={`p-3 rounded mb-4 text-center text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Specialization</label>
            <Input
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="e.g. Cardiologist"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Qualifications</label>
            <Input
              name="qualifications"
              value={formData.qualifications}
              onChange={handleChange}
              placeholder="e.g. MBBS, MD"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Experience (Years)</label>
              <Input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Consultation Fee ($)</label>
              <Input
                type="number"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleChange}
                placeholder="50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Available Days (comma separated)
            </label>
            <Input
              name="availableDays"
              value={formData.availableDays}
              onChange={handleChange}
              placeholder="Monday, Tuesday, Wednesday"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Time Slots (comma separated)
            </label>
            <Input
              name="timeSlots"
              value={formData.timeSlots}
              onChange={handleChange}
              placeholder="09:00 AM, 10:00 AM, 02:00 PM"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio / About</label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-2 border rounded-md text-sm"
              placeholder="Brief description about your practice..."
            />
          </div>

          <Button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {saving ? 'Saving...' : 'Save Doctor Profile'}
          </Button>
        </form>
      </div>
    </div>
  );
}
