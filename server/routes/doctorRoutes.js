const express = require('express');
const { getDoctors, getDoctorById, upsertDoctorProfile } = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.post('/profile', protect, authorize('doctor'), upsertDoctorProfile);

module.exports = router;