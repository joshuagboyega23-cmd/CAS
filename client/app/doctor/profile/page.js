'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import API from '../../../lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DoctorProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    specialization: '',
    qualifications: '',
    experienceYears: '',
    consultationFee: '',
    bio: '',
    availableDays: 'Monday, Tuesday, Wednesday, Thursday, Friday',
    timeSlots: '09:00 AM, 10:00 AM, 11:00 AM, 02:00 PM, 03:00 PM',
  });

  const [avatar, setAvatar] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/doctors');
        const myDoc = data.data.find((d) => d.user?._id === user?.id);
        if (myDoc) {
          setFormData({
            specialization: myDoc.specialization || '',
            qualifications: myDoc.qualifications || '',
            experienceYears: myDoc.experienceYears || '',
            consultationFee: myDoc.consultationFee || '',
            bio: myDoc.bio || '',
            availableDays: myDoc.availableDays ? myDoc.availableDays.join(', ') : '',
            timeSlots: myDoc.timeSlots ? myDoc.timeSlots.join(', ') : '',
          });
          setAvatar(myDoc.user?.avatar || '');
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };

    if (user && user.role === 'doctor') {
      fetchProfile();
    }
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    setUploading(true);
    try {
      const { data } = await API.post('/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAvatar(data.url);
      setMessage({ type: 'success', text: 'Image uploaded successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Image upload failed' });
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        ...formData,
        experienceYears: Number(formData.experienceYears),
        consultationFee: Number(formData.consultationFee),
        availableDays: formData.availableDays.split(',').map((d) => d.trim()),
        timeSlots: formData.timeSlots.split(',').map((t) => t.trim()),
        avatar,
      };

      await API.post('/doctors/profile', payload);
      setMessage({ type: 'success', text: 'Doctor profile updated successfully!' });
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update doctor profile',
      });
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'doctor') {
    return (
      <div className="p-8 text-center text-red-600 font-semibold">
        Access Denied. Only doctor accounts can access this page.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Doctor Profile Settings</h1>
          <Link href="/dashboard" className="text-blue-600 hover:underline text-sm font-medium">
            ← Back to Dashboard
          </Link>
        </div>

        {message.text && (
          <div
          className={`p-3 rounded-md mb-4 text-sm ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Profile Image Section */}
        <div className="mb-6 flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border">
            {avatar ? (
              <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 font-bold text-2xl">Dr</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploading && <p className="text-xs text-blue-600 mt-1">Uploading image...</p>}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Specialization</label>
            <input
              type="text"
              name="specialization"
              placeholder="e.g. Cardiologist, Dermatologist, General Physician"
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={formData.specialization}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Qualifications</label>
            <input
              type="text"
              name="qualifications"
              placeholder="e.g. MBBS, MD, FWACP"
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={formData.qualifications}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Experience (Years)</label>
              <input
                type="number"
                name="experienceYears"
                required
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                value={formData.experienceYears}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Consultation Fee ($)</label>
              <input
                type="number"
                name="consultationFee"
                required
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                value={formData.consultationFee}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Available Days (comma separated)</label>
            <input
              type="text"
              name="availableDays"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={formData.availableDays}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Time Slots (comma separated)</label>
            <input
              type="text"
              name="timeSlots"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={formData.timeSlots}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bio / About</label>
            <textarea
              name="bio"
              rows={3}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading ? 'Saving Profile...' : 'Save Doctor Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}