import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: null,
    initialized: false
  });

  const navigate = useNavigate();

  // Carga inicial desde localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        setAuth({
          user: parsedAuth.user,
          token: parsedAuth.token || null,
          initialized: true
        });
      } catch {
        setAuth({ user: null, token: null, initialized: true });
      }
    } else {
      setAuth(prev => ({ ...prev, initialized: true }));
    }
  }, []);

  const login = (responseData) => {
    const authData = {
      user: {
        email: responseData.user.email,
        name: responseData.user.name,
        // Agrega otros campos básicos del usuario que necesites
      },
      token: responseData.token || null,
      initialized: true
    };
    localStorage.setItem('auth', JSON.stringify(authData));
    setAuth(authData);
    navigate('/profile'); // Redirige al perfil después de login
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setAuth({ user: null, token: null, initialized: true });
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{
      user: auth.user,
      token: auth.token,
      initialized: auth.initialized,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};