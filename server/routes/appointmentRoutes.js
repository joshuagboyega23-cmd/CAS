const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Create new appointment & initialize Paystack
// @route   POST /api/v1/appointments
// @access  Private
const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, type, reason } = req.body;

    if (!doctorId || !date || !timeSlot) {
      return res.status(400).json({ message: 'Please provide doctorId, date, and timeSlot' });
    }

    // 1. Get patient email directly from DB
    const userDoc = await User.findById(req.user._id);
    const userEmail = userDoc?.email || req.user?.email || 'patient@example.com';

    // 2. Save appointment in DB
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      timeSlot,
      type: type || 'consultation',
      reason: reason || '',
      status: 'pending',
    });

    // 3. Initialize Paystack using native fetch
    let authorization_url = null;
    const paystackKey = process.env.PAYSTACK_SECRET_KEY ? process.env.PAYSTACK_SECRET_KEY.trim() : null;
    const clientUrl = (process.env.CLIENT_URL || 'https://cas-ebon.vercel.app').replace(/\/$/, '');

    if (paystackKey) {
      try {
        const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${paystackKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userEmail,
            amount: 500000, // 5000 NGN in kobo
            callback_url: `${clientUrl}/dashboard`,
            metadata: {
              appointmentId: appointment._id.toString(),
            },
          }),
        });

        const paystackData = await paystackRes.json();
        if (paystackData?.data?.authorization_url) {
          authorization_url = paystackData.data.authorization_url;
        }
      } catch (paystackErr) {
        console.error('Paystack initialization error:', paystackErr.message || paystackErr);
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
const getAppointments = async (req, res) => {
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
    res.status(500).json({ message: error.message || 'Server error fetching appointments' });
  }
};

// @desc    Get single appointment
// @route   GET /api/v1/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctor')
      .populate('patient', 'name email');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ success: true, appointment });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching appointment' });
  }
};

// @desc    Update appointment status
// @route   PUT /api/v1/appointments/:id
// @access  Private
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (status) appointment.status = status;
    await appointment.save();

    res.status(200).json({ success: true, appointment });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: error.message || 'Server error updating appointment' });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/v1/appointments/:id/cancel
// @access  Private
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.status(200).json({ success: true, appointment, message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ message: error.message || 'Server error cancelling appointment' });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/v1/appointments/:id
// @access  Private
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ message: error.message || 'Server error deleting appointment' });
  }
};

module.exports = {
  createAppointment,
  bookAppointment: createAppointment,
  getAppointments,
  getMyAppointments: getAppointments,
  getAppointmentById,
  getAppointment: getAppointmentById,
  updateAppointmentStatus,
  updateAppointment: updateAppointmentStatus,
  updateStatus: updateAppointmentStatus,
  cancelAppointment,
  deleteAppointment,
};