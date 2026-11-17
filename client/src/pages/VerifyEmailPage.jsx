import { useState } from 'react';
import { api } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.js';
import Alert from '../components/Alert.jsx';
import AuthLayout from '../components/AuthLayout.jsx';
import Button from '../components/Button.jsx';
import ResendButton from '../components/ResendButton.jsx';
import TextField from '../components/TextField.jsx';
import { useForm } from '../hooks/useForm.js';

export default function VerifyEmailPage() {
  const { merchant, setMerchant, logout } = useAuth();
  const { values, errors, formError, isSubmitting, handleChange, handleSubmit } = useForm({
    otp: '',
  });
  const [resendNotice, setResendNotice] = useState({ type: 'success', text: '' });

  // Right code -> the server returns isEmailVerified: true -> AuthGate opens the home page
  const verify = handleSubmit(async (form) => {
    const data = await api('/auth/verify-email', { method: 'POST', body: form });
    setMerchant(data.merchant);
  });

  async function resend() {
    try {
      const data = await api('/auth/resend-verification', { method: 'POST' });
      setResendNotice({ type: 'success', text: data.message });
      return true;
    } catch (error) {
      setResendNotice({ type: 'error', text: error.message });
      return false;
    }
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={`We sent a 6-digit code to ${merchant.email}. Check your spam folder too.`}
    >
      <form onSubmit={verify} noValidate className="space-y-4">
        <TextField
          label="Verification code"
          name="otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="6-digit code"
          value={values.otp}
          onChange={handleChange}
          error={errors.otp}
        />
        <Alert>{formError}</Alert>
        <Button type="submit" isLoading={isSubmitting}>
          Verify email
        </Button>
      </form>

      <div className="mt-6 space-y-3">
        <Alert type={resendNotice.type}>{resendNotice.text}</Alert>
        <ResendButton onResend={resend} />
        <button type="button" onClick={logout} className="w-full text-sm text-gray-500">
          Log out
        </button>
      </div>
    </AuthLayout>
  );
}
