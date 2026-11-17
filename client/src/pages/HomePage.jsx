import { useAuth } from '../auth/AuthContext.js';

// Placeholder home page. The real vendor dashboard comes in the next days.
export default function HomePage() {
  const { merchant, logout } = useAuth();

  return (
    <main className="min-h-svh bg-orange-50 px-4 py-10">
      <div className="mx-auto w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">Welcome,</p>
        <h1 className="text-xl font-semibold text-gray-900">{merchant.ownerName}</h1>
        <p className="mt-1 text-gray-600">{merchant.businessName}</p>

        <p className="mt-6 rounded-xl bg-orange-50 p-3 text-sm text-orange-700">
          Your dashboard is coming soon.
        </p>

        <button
          type="button"
          onClick={logout}
          className="mt-6 h-12 w-full rounded-xl border border-gray-300 font-semibold text-gray-700 active:bg-gray-100"
        >
          Log out
        </button>
      </div>
    </main>
  );
}
