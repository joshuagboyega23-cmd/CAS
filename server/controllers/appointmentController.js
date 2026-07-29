const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const axios = require('axios');

// Safe optional require for sendEmail module
let sendEmail = null;
try {
  sendEmail = require('../utils/sendEmail');
} catch (e) {
  console.log('sendEmail module not found, continuing without email notifications.');
}

// @desc    Create new appointment & initialize Paystack
// @route   POST /api/v1/appointments
// @access  Private
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, type, reason } = req.body;

    if (!doctorId || !date || !timeSlot) {
      return res.status(400).json({ message: 'Please provide doctorId, date, and timeSlot' });
    }

    // 1. Save appointment in MongoDB
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      timeSlot,
      type: type || 'consultation',
      reason: reason || '',
      status: 'pending',
    });

    // 2. Safely attempt Email Notification
    if (sendEmail && typeof sendEmail === 'function' && req.user?.email) {
      try {
        await sendEmail({
          email: req.user.email,
          subject: 'Appointment Booking Confirmation',
          message: `Your appointment for ${date} at ${timeSlot} has been created.`,
        });
      } catch (emailErr) {
        console.error('Email sending failed (non-blocking):', emailErr.message);
      }
    }

    // 3. Safely initialize Paystack Payment
    let authorization_url = null;

    if (process.env.PAYSTACK_SECRET_KEY) {
      try {
        const paystackRes = await axios.post(
          'https://api.paystack.co/transaction/initialize',
          {
            email: req.user.email,
            amount: 500000, // 5000 NGN in kobo
            callback_url: `${process.env.CLIENT_URL || 'https://cas-ebon.vercel.app'}/dashboard`,
            metadata: {
              appointmentId: appointment._id.toString(),
            },
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY.trim()}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (paystackRes.data?.data?.authorization_url) {
          authorization_url = paystackRes.data.data.authorization_url;
        }
      } catch (paystackErr) {
        console.error('Paystack initialization warning:', paystackErr?.response?.data || paystackErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      appointment,
      authorization_url,
      message: authorization_url
        ? 'Appointment created. Redirecting to payment...'
        : 'Appointment booked successfully!',
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: error.message || 'Server error creating appointment' });
  }
};

// @desc    Get appointments for logged in user
// @route   GET /api/v1/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
  try {
    let appointments = [];

    if (req.user.role === 'patient') {
      appointments = await Appointment.find({ patient: req.user._id })
        .populate('doctor')
        .populate('patient', 'name email')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ user: req.user._id });
      if (!doctorProfile) {
        return res.status(200).json({ success: true, appointments: [] });
      }
      appointments = await Appointment.find({ doctor: doctorProfile._id })
        .populate('patient', 'name email')
        .populate('doctor')
        .sort({ createdAt: -1 });
    } else {
      appointments = await Appointment.find()
        .populate('doctor')
        .populate('patient', 'name email')
        .sort({ createdAt: -1 });
    }

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.
    status(500).json({ message: error.message || 'Server error fetching appointments' });
  }
};