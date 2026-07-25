const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  updateAppointmentStatus,
  addPrescription,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, bookAppointment);
router.get('/my', protect, getMyAppointments);
router.put('/:id/status', protect, updateAppointmentStatus);
router.post('/:id/prescription', protect, addPrescription);

module.exports = router;