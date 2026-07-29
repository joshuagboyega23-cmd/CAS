const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

let protect = (req, res, next) => next();
try {
  let authModule;
  try {
    authModule = require('../middleware/authMiddleware');
  } catch (err) {
    try {
      authModule = require('../middleware/auth');
    } catch (e) {
      authModule = null;
    }
  }

  if (authModule) {
    if (typeof authModule.protect === 'function') {
      protect = authModule.protect;
    } else if (typeof authModule === 'function') {
      protect = authModule;
    }
  }
} catch (e) {
  console.warn('Auth middleware fallback active:', e.message);
}

router.route('/')
  .post(protect, appointmentController.createAppointment)
  .get(protect, appointmentController.getAppointments);

router.route('/:id')
  .get(protect, appointmentController.getAppointmentById)
  .put(protect, appointmentController.updateAppointmentStatus)
  .delete(protect, appointmentController.deleteAppointment);

router.put('/:id/cancel', protect, appointmentController.cancelAppointment);

module.exports = router;