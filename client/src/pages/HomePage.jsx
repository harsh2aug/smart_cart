import { Link } from 'react-router';
import { useAuth } from '../auth/AuthContext.js';
import AppLayout from '../components/AppLayout.jsx';
import OpenClosedCard from '../components/OpenClosedCard.jsx';

// The vendor's home page. Orders and menu will be added here in the next days.
export default function HomePage() {
  const { merchant, logout } = useAuth();

  return (
    <AppLayout title={merchant.businessName}>
      <p className="text-gray-600">Hello, {merchant.ownerName} 👋</p>

      <OpenClosedCard />

      <Link
        to="/profile"
        className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm active:bg-gray-50"
      >
        <span>
          <span className="block font-semibold text-gray-900">Profile</span>
          <span className="block text-sm text-gray-600">Cart name, description and location</span>
        </span>
        <span aria-hidden="true" className="text-xl text-gray-400">
          →
        </span>
      </Link>

      <button
        type="button"
        onClick={logout}
        className="h-12 w-full rounded-xl border border-gray-300 bg-white font-semibold text-gray-700 active:bg-gray-100"
      >
        Log out
      </button>
    </AppLayout>
  );
}
