const Doctor = require('../models/Doctor');

// @desc    Get all doctors (with search & specialization filter)
// @route   GET /api/v1/doctors
// @access  Public
exports.getDoctors = async (req, res) => {
  try {
    const { specialization, search } = req.query;
    let query = {};

    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    let doctors = await Doctor.find(query).populate('user', 'name email phone avatar');

    if (search) {
      doctors = doctors.filter(doc =>
        doc.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        doc.specialization?.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.status(200).json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single doctor by ID
// @route   GET /api/v1/doctors/:id
// @access  Public
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email phone avatar');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create or update doctor profile
// @route   POST /api/v1/doctors/profile
// @access  Private (Doctor only)
exports.upsertDoctorProfile = async (req, res) => {
  try {
    const { specialization, qualifications, experienceYears, consultationFee, bio, availableDays, timeSlots } = req.body;

    const profileFields = {
      user: req.user.id,
      specialization,
      qualifications,
      experienceYears,
      consultationFee,
      bio: bio || '',
      ...(availableDays && { availableDays }),
      ...(timeSlots && { timeSlots }),
    };

    let doctor = await Doctor.findOne({ user: req.user.id });

    if (doctor) {
      doctor = await Doctor.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, runValidators: true }
      );
      return res.status(200).json({ success: true, data: doctor, message: 'Profile updated' });
    }

    doctor = await Doctor.create(profileFields);
    res.status(201).json({ success: true, data: doctor, message: 'Profile created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};