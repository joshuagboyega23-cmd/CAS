const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const sendEmail = require('../utils/sendEmail');

// @desc    Book a new appointment
// @route   POST /api/v1/appointments
// @access  Private (Patient)
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, reason } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      timeSlot,
      reason,
    });

    // Send confirmation email to patient
    try {
      await sendEmail({
        email: req.user.email,
        subject: 'Appointment Booking Confirmation - Clinic Care',
        html: `
          <h2>Appointment Confirmation 🏥</h2>
          <p>Hello <strong>${req.user.name}</strong>,</p>
          <p>Your appointment has been successfully scheduled!</p>
          <hr />
          <p>📅 <strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
          <p>⏰ <strong>Time Slot:</strong> ${timeSlot}</p>
          <p>📝 <strong>Reason:</strong> ${reason}</p>
          <hr />
          <p>Please log in to your dashboard to complete payment if applicable.</p>
        `,
      });
    } catch (emailErr) {
      console.error('Email sending failed:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged-in user appointments
// @route   GET /api/v1/appointments/my
// @access  Private
exports.getMyAppointments = async (req, res) => {
  try {
    let appointments;

    if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ user: req.user._id });
      if (!doctorProfile) {
        return res.status(200).json({ success: true, data: [] });
      }
      appointments = await Appointment.find({ doctor: doctorProfile._id })
        .populate('patient', 'name email phone')
        .sort({ date: -1 });
    } else {
      appointments = await Appointment.find({ patient: req.user._id })
        .populate({
          path: 'doctor',
          populate: { path: 'user', select: 'name email' },
        })
        .sort({ date: -1 });
    }

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update appointment status
// @route   PUT /api/v1/appointments/:id/status
// @access  Private (Doctor)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add or update prescription / medical notes
// @route   POST /api/v1/appointments/:id/prescription
// @access  Private (Doctor)
exports.addPrescription = async (req, res) => {
  try {
    const { diagnosis, notes, medicines } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.prescription = {
      diagnosis,
      notes,
      medicines: medicines || [],
      updatedAt: new Date(),
    };
    appointment.status = 'completed';

    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Prescription saved and appointment completed!',
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};