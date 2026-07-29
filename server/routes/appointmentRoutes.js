const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// 1. Safely import Auth Middleware (handles both authMiddleware.js and auth.js)
let protect = (req, res, next) => next(); // default fallback
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

// 2. Safe controller extractors
const createAppointment =
  appointmentController.createAppointment ||
  appointmentController.bookAppointment ||
  ((req, res) => res.status(500).json({ message: 'Create appointment controller missing' }));

const getAppointments =
  appointmentController.getAppointments ||
  appointmentController.getMyAppointments ||
  ((req, res) => res.status(500).json({ message: 'Get appointments controller missing' }));

const getAppointmentById =
  appointmentController.getAppointmentById ||
  appointmentController.getAppointment ||
  ((req, res) => res.status(500).json({ message: 'Get appointment by ID controller missing' }));

const updateAppointmentStatus =
  appointmentController.updateAppointmentStatus ||
  appointmentController.updateAppointment ||
  ((req, res) => res.status(500).json({ message: 'Update appointment controller missing' }));

const cancelAppointment =
  appointmentController.cancelAppointment ||
  ((req, res) => res.status(500).json({ message: 'Cancel appointment controller missing' }));

const deleteAppointment =
  appointmentController.deleteAppointment ||
  ((req, res) => res.status(500).json({ message: 'Delete appointment controller missing' }));

// 3. Define Routes cleanly
router.route('/')
  .post(protect, createAppointment)
  .get(protect, getAppointments);

router.route('/:id')
  .get(protect, getAppointmentById)
  .put(protect, updateAppointmentStatus)
  .delete(protect, deleteAppointment);

router.put('/:id/cancel', protect, cancelAppointment);

// 4. Export Router instance
module.exports = router;