// AuthContext.jsx
import { createContext, useState, useContext } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook for consuming the AuthContext
export const useAuth = () => useContext(AuthContext);

// Context provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
