import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { api } from '../api/client.js';
import Alert from '../components/Alert.jsx';
import AuthLayout from '../components/AuthLayout.jsx';
import Button from '../components/Button.jsx';
import ResendButton from '../components/ResendButton.jsx';
import TextField from '../components/TextField.jsx';
import { useForm } from '../hooks/useForm.js';

// Two steps on one page:
//   Step 1: enter your email -> we send a code
//   Step 2: enter the code + a new password
export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(''); // empty = step 1, filled = step 2
  const [notice, setNotice] = useState({ type: 'success', text: '' });
  const emailForm = useForm({ email: '' });
  const resetForm = useForm({ otp: '', password: '' });

  const sendCode = emailForm.handleSubmit(async (form) => {
    const data = await api('/auth/forgot-password', { method: 'POST', body: form });
    setNotice({ type: 'success', text: data.message });
    setEmail(form.email); // go to step 2
  });

  const resetPassword = resetForm.handleSubmit(async (form) => {
    const data = await api('/auth/reset-password', { method: 'POST', body: { email, ...form } });
    navigate('/login', { state: { message: data.message } });
  });

  async function resend() {
    try {
      const data = await api('/auth/forgot-password', { method: 'POST', body: { email } });
      setNotice({ type: 'success', text: data.message });
      return true;
    } catch (error) {
      setNotice({ type: 'error', text: error.message });
      return false;
    }
  }

  function changeEmail() {
    setEmail('');
    setNotice({ type: 'success', text: '' });
  }

  if (!email) {
    return (
      <AuthLayout
        title="Forgot password?"
        subtitle="Enter the email you registered with. We will send you a code."
      >
        <form onSubmit={sendCode} noValidate className="space-y-4">
          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={emailForm.values.email}
            onChange={emailForm.handleChange}
            error={emailForm.errors.email}
          />
          <Alert>{emailForm.formError}</Alert>
          <Button type="submit" isLoading={emailForm.isSubmitting}>
            Send code
          </Button>
        </form>

        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="font-semibold text-orange-600">
            Back to log in
          </Link>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set a new password" subtitle={`Enter the code we sent to ${email}.`}>
      <form onSubmit={resetPassword} noValidate className="space-y-4">
        <Alert type={notice.type}>{notice.text}</Alert>
        <TextField
          label="Code"
          name="otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="6-digit code"
          value={resetForm.values.otp}
          onChange={resetForm.handleChange}
          error={resetForm.errors.otp}
        />
        <TextField
          label="New password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={resetForm.values.password}
          onChange={resetForm.handleChange}
          error={resetForm.errors.password}
        />
        <Alert>{resetForm.formError}</Alert>
        <Button type="submit" isLoading={resetForm.isSubmitting}>
          Change password
        </Button>
      </form>

      <div className="mt-6 space-y-3">
        <ResendButton onResend={resend} />
        <button type="button" onClick={changeEmail} className="w-full text-sm text-gray-500">
          Use a different email
        </button>
      </div>
    </AuthLayout>
  );
}
