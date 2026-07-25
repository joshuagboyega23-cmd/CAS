const axios = require('axios');
const Appointment = require('../models/Appointment');
const sendEmail = require('../utils/sendEmail');

// @desc    Initialize Paystack Payment
// @route   POST /api/v1/payments/initialize
// @access  Private
exports.initializePayment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId).populate('patient', 'email name');
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const amountInKobo = 500000;

    const paystackResponse = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: appointment.patient.email,
        amount: amountInKobo,
        callback_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard`,
        metadata: {
          appointmentId: appointment._id.toString(),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json({
      success: true,
      authorization_url: paystackResponse.data.data.authorization_url,
      reference: paystackResponse.data.data.reference,
    });
  } catch (error) {
    console.error('Paystack error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Payment initialization failed' });
  }
};

// @desc    Verify Paystack Payment
// @route   GET /api/v1/payments/verify/:reference
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const { status, metadata, amount } = response.data.data;

    if (status === 'success') {
      const appointmentId = metadata.appointmentId;

      const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { paymentStatus: 'paid', status: 'confirmed' },
        { new: true }
      ).populate('patient', 'email name');

      if (appointment && appointment.patient?.email) {
        try {
          await sendEmail({
            email: appointment.patient.email,
            subject: 'Payment Receipt - Clinic Care',
            html: `
              <h2>Payment Successful 🎉</h2>
              <p>Hello <strong>${appointment.patient.name}</strong>,</p>
              <p>We received your payment for your clinic appointment.</p>
              <hr />
              <p>💳 <strong>Amount Paid:</strong> ₦${amount / 100}</p>
              <p>🔖 <strong>Reference:</strong> ${reference}</p>
              <p>✅ <strong>Payment Status:</strong> PAID</p>
              <hr />
              <p>Thank you for choosing Clinic Care!</p>
            `,
          });
        } catch (emailErr) {
          console.error('Receipt email sending failed:', emailErr.message);
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Payment verified and appointment confirmed!',
        data: appointment,
      });
    } else {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Verification error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Server error verifying payment' });
  }
};