import { useState } from 'react';
import { api } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.js';
import Alert from './Alert.jsx';

// The big Open / Closed switch on the home page.
// Open = customers can order. Closed = they can see the menu but can't order.
export default function OpenClosedCard() {
  const { merchant, setMerchant } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const { isOpen } = merchant;

  async function toggle() {
    setIsSaving(true);
    setError('');
    try {
      const data = await api('/merchant/status', { method: 'PATCH', body: { isOpen: !isOpen } });
      setMerchant(data.merchant); // the whole app now sees the new status
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className={`size-3 rounded-full ${isOpen ? 'bg-green-500' : 'bg-gray-400'}`} />
        <p className="text-lg font-semibold text-gray-900">
          Your cart is {isOpen ? 'open' : 'closed'}
        </p>
      </div>
      <p className="mt-1 text-sm text-gray-600">
        {isOpen
          ? 'Customers can place orders now.'
          : 'Customers can see your menu but cannot order.'}
      </p>

      <button
        type="button"
        role="switch"
        aria-checked={isOpen}
        onClick={toggle}
        disabled={isSaving}
        className={`mt-4 h-14 w-full rounded-xl text-lg font-semibold text-white disabled:opacity-60 ${
          isOpen ? 'bg-gray-700 active:bg-gray-800' : 'bg-green-600 active:bg-green-700'
        }`}
      >
        {isSaving ? 'Please wait…' : isOpen ? 'Close cart' : 'Open cart'}
      </button>

      <div className="mt-3">
        <Alert>{error}</Alert>
      </div>
    </section>
  );
}
