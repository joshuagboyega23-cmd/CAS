const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  deleteAppointment,
  getDoctorAppointments,
  markNotificationsRead
} = require('../controllers/appointmentController');

// Doctor notification and specific schedule routes
router.get('/doctor/my-appointments', protect, getDoctorAppointments);
router.put('/doctor/mark-read', protect, markNotificationsRead);

// Standard appointment CRUD routes
router.route('/')
  .post(protect, createAppointment)
  .get(protect, getAppointments);

router.route('/:id')
  .get(protect, getAppointmentById)
  .put(protect, updateAppointmentStatus)
  .delete(protect, deleteAppointment);

router.put('/:id/cancel', protect, cancelAppointment);

module.exports = router;