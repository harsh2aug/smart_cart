import { Link } from 'react-router';
import { api } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.js';
import Alert from '../components/Alert.jsx';
import AuthLayout from '../components/AuthLayout.jsx';
import Button from '../components/Button.jsx';
import TextField from '../components/TextField.jsx';
import { useForm } from '../hooks/useForm.js';

export default function RegisterPage() {
  const { setMerchant } = useAuth();
  const { values, errors, formError, isSubmitting, handleChange, handleSubmit } = useForm({
    businessName: '',
    ownerName: '',
    phone: '',
    email: '',
    password: '',
  });

  // The server logs the new merchant in and emails a code.
  // AuthGate then opens the "Verify your email" page by itself.
  const register = handleSubmit(async (form) => {
    const data = await api('/auth/register', { method: 'POST', body: form });
    setMerchant(data.merchant);
  });

  return (
    <AuthLayout title="Create your account" subtitle="Start taking orders at your cart.">
      <form onSubmit={register} noValidate className="space-y-4">
        <TextField
          label="Cart / business name"
          name="businessName"
          autoComplete="organization"
          placeholder="e.g. Raju Chaat Corner"
          value={values.businessName}
          onChange={handleChange}
          error={errors.businessName}
        />
        <TextField
          label="Your name"
          name="ownerName"
          autoComplete="name"
          value={values.ownerName}
          onChange={handleChange}
          error={errors.ownerName}
        />
        <TextField
          label="Mobile number"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={10}
          placeholder="You will log in with this"
          value={values.phone}
          onChange={handleChange}
          error={errors.phone}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="We send codes here"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Alert>{formError}</Alert>
        <Button type="submit" isLoading={isSubmitting}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-orange-600">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
