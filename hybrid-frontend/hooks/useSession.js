import { useContext, createContext, useState } from 'react';

const AuthContext = createContext();

export const useSession = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // Almacena la información del usuario

  const login = (userData, userToken) => {
    setIsAuthenticated(true);
    setToken(userToken);
    setUser(userData); // Establece el usuario
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    setUser(null); // Limpia el usuario
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
