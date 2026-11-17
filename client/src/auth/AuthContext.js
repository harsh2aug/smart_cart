import { createContext, useContext } from 'react';

// Shares "who is logged in" with every page, without passing props down
export const AuthContext = createContext(null);

// In any page: const { merchant, setMerchant, logout } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
