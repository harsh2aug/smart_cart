import { useState } from 'react';
import { api } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.js';
import Alert from '../components/Alert.jsx';
import AppLayout from '../components/AppLayout.jsx';
import Button from '../components/Button.jsx';
import TextField from '../components/TextField.jsx';
import { useForm } from '../hooks/useForm.js';

export default function ProfilePage() {
  const { merchant, setMerchant } = useAuth();
  const [isSaved, setIsSaved] = useState(false);

  // Start with the current details. Empty fields are null in the database, '' in an input.
  const { values, errors, formError, isSubmitting, handleChange, handleSubmit } = useForm({
    businessName: merchant.businessName,
    ownerName: merchant.ownerName,
    description: merchant.description ?? '',
    address: merchant.address ?? '',
    city: merchant.city ?? '',
  });

  const save = handleSubmit(async (form) => {
    setIsSaved(false);
    const data = await api('/merchant/profile', { method: 'PATCH', body: form });
    setMerchant(data.merchant); // the home page title updates too
    setIsSaved(true);
  });

  return (
    <AppLayout title="Profile" backTo="/">
      <form onSubmit={save} noValidate className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
        <TextField
          label="Cart / business name"
          name="businessName"
          autoComplete="organization"
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
          label="About your cart (optional)"
          name="description"
          multiline
          maxLength={500}
          placeholder="e.g. Fresh pani puri and chaat since 2015"
          value={values.description}
          onChange={handleChange}
          error={errors.description}
        />
        <TextField
          label="Where is your cart? (optional)"
          name="address"
          autoComplete="street-address"
          placeholder="e.g. Opp. City Mall, Ring Road"
          value={values.address}
          onChange={handleChange}
          error={errors.address}
        />
        <TextField
          label="City (optional)"
          name="city"
          autoComplete="address-level2"
          value={values.city}
          onChange={handleChange}
          error={errors.city}
        />

        <Alert>{formError}</Alert>
        <Alert type="success">{isSaved && 'Profile saved'}</Alert>
        <Button type="submit" isLoading={isSubmitting}>
          Save
        </Button>
      </form>

      {/* Phone and email are used for login and codes, so they can't be changed here */}
      <section className="space-y-3 rounded-2xl bg-white p-5 text-sm shadow-sm">
        <div>
          <p className="text-gray-500">Mobile number (for login)</p>
          <p className="font-medium text-gray-900">{merchant.phone}</p>
        </div>
        <div>
          <p className="text-gray-500">Email</p>
          <p className="font-medium text-gray-900">{merchant.email}</p>
        </div>
      </section>
    </AppLayout>
  );
}
