import { Navigate, Outlet } from 'react-router';
import { useAuth } from './AuthContext.js';

// Every kind of user has a "home" page
const HOME_PAGE = {
  guest: '/login', // logged out
  unverified: '/verify-email', // logged in, email not verified yet
  verified: '/', // logged in and verified
};

// Shows the pages inside it only to one kind of user (allow="guest" | "unverified" | "verified").
// Anyone else is sent to their own home page.
export default function AuthGate({ allow }) {
  const { merchant, isLoading } = useAuth();

  if (isLoading) {
    return <p className="flex min-h-svh items-center justify-center text-gray-500">Loading…</p>;
  }

  let status = 'guest';
  if (merchant) {
    status = merchant.isEmailVerified ? 'verified' : 'unverified';
  }

  if (status !== allow) {
    return <Navigate to={HOME_PAGE[status]} replace />;
  }
  return <Outlet />; // the page that matched the URL
}
