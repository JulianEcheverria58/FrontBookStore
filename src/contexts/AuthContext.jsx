import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simular usuario con balance
    setUser({
      name: "Julian Echeverria",
      email: "julianecheverria525@gmail.com",
      balance: 550000 
    });
  }, []);

  const updateBalance = (amount) => {
    setUser(prev => ({
      ...prev,
      balance: prev.balance - amount
    }));
  };

  return (
    <AuthContext.Provider value={{ user, updateBalance }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);