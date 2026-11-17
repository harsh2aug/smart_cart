import { Link, useLocation } from 'react-router';
import { api } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.js';
import Alert from '../components/Alert.jsx';
import AuthLayout from '../components/AuthLayout.jsx';
import Button from '../components/Button.jsx';
import TextField from '../components/TextField.jsx';
import { useForm } from '../hooks/useForm.js';

export default function LoginPage() {
  const { setMerchant } = useAuth();
  const location = useLocation(); // carries a message from another page, e.g. "Password changed"
  const { values, errors, formError, isSubmitting, handleChange, handleSubmit } = useForm({
    phone: '',
    password: '',
  });

  // After login we only save the merchant. AuthGate then opens the right page by itself.
  const login = handleSubmit(async (form) => {
    const data = await api('/auth/login', { method: 'POST', body: form });
    setMerchant(data.merchant);
  });

  return (
    <AuthLayout title="Log in" subtitle="Welcome back! Log in to manage your cart.">
      <form onSubmit={login} noValidate className="space-y-4">
        <Alert type="success">{location.state?.message}</Alert>

        <TextField
          label="Mobile number"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={10}
          placeholder="10-digit mobile number"
          value={values.phone}
          onChange={handleChange}
          error={errors.phone}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />

        <div className="text-right">
          <Link to="/forgot-password" className="text-sm font-medium text-orange-600">
            Forgot password?
          </Link>
        </div>

        <Alert>{formError}</Alert>
        <Button type="submit" isLoading={isSubmitting}>
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        New to SmartCart?{' '}
        <Link to="/register" className="font-semibold text-orange-600">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
