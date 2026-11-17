import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { AuthContext } from './AuthContext.js';

export default function AuthProvider({ children }) {
  const [merchant, setMerchant] = useState(null); // null = logged out
  const [isLoading, setIsLoading] = useState(true); // true until the server answers

  // When the app opens, ask the server who is logged in.
  // We can't read the login cookie ourselves (it is httpOnly), but the browser sends it.
  useEffect(() => {
    api('/auth/me')
      .then((data) => setMerchant(data.merchant))
      .catch(() => setMerchant(null))
      .finally(() => setIsLoading(false));
  }, []);

  async function logout() {
    try {
      await api('/auth/logout', { method: 'POST' });
    } finally {
      setMerchant(null);
    }
  }

  return <AuthContext value={{ merchant, setMerchant, isLoading, logout }}>{children}</AuthContext>;
}
