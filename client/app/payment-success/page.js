'use client';

import Link from 'next/link';

export default function PaymentSuccessPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '40px',
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Success Icon */}
        <div style={{
          fontSize: '48px',
          marginBottom: '16px'
        }}>
          🎉
        </div>

        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '8px'
        }}>
          Payment Successful!
        </h1>

        <p style={{
          color: '#4b5563',
          fontSize: '15px',
          marginBottom: '24px',
          lineHeight: '1.5'
        }}>
          Your appointment has been confirmed. A receipt and confirmation details have been sent to your email address.
        </p>

        <Link href="/" style={{
          display: 'inline-block',
          backgroundColor: '#2563eb',
          color: '#ffffff',
          fontWeight: '600',
          padding: '12px 24px',
          borderRadius: '8px',
          textDecoration: 'none',
          transition: 'background-color 0.2s'
        }}>
          Return to Home
        </Link>
      </div>
    </div>
  );
}