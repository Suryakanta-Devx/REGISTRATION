import { useEffect, useState } from 'react';
import { apiRequest, getAuthToken, setAuthToken } from '../services/api';
import { AuthContext } from './authContextBase';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(() => Boolean(getAuthToken()));

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;
    let active = true;
    apiRequest('/auth/me')
      .then((res) => {
        if (active) setUser(res.user);
      })
      .catch(() => {
        if (active) {
          setAuthToken('');
          setUser(null);
        }
      })
      .finally(() => {
        if (active) setLoadingAuth(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const registerAccount = async (payload) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const updateProfile = async (payload) => {
    const data = await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    setAuthToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loadingAuth,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin',
        login,
        registerAccount,
        updateProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
