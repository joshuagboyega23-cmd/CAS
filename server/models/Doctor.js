const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, 'Please add a specialization'],
      trim: true,
    },
    qualifications: {
      type: String,
      required: [true, 'Please add qualifications'],
    },
    experienceYears: {
      type: Number,
      required: [true, 'Please add years of experience'],
    },
    consultationFee: {
      type: Number,
      required: [true, 'Please add a consultation fee'],
    },
    bio: {
      type: String,
      default: '',
    },
    availableDays: {
      type: [String], // e.g., ['Monday', 'Wednesday', 'Friday']
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    timeSlots: {
      type: [String], // e.g., ['09:00 AM', '11:00 AM', '02:00 PM']
      default: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
    },
    isApproved: {
      type: Boolean,
      default: true, // Set to false if you want admin approval flow
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Doctor', doctorSchema);