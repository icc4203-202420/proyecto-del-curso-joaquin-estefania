import { useContext, createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { registerPushToken } from '../utils/notifications'; // Importa la función para registrar el push token

const AuthContext = createContext();

export const useSession = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // Almacena la información del usuario
  const [loading, setLoading] =useState(true); // Estado de carga para verificar la sesión al inicio

  // Función para guardar el token en Secure Storage
  const saveTokenToStorage = async (userToken) => {
    await SecureStore.setItemAsync('auth_token', userToken);
  };

  // Función para eliminar el token de Secure Storage
  const removeTokenFromStorage = async () => {
    await SecureStore.deleteItemAsync('auth_token');
  };

  // Función para leer el token desde Secure Storage
  const getTokenFromStorage = async () => {
    return await SecureStore.getItemAsync('auth_token');
  };

  // Iniciar sesión: guarda el token en Secure Storage, actualiza el estado, y registra el push token
  const login = async (userData, userToken) => {
    setIsAuthenticated(true);
    setToken(userToken);
    setUser(userData);
    await saveTokenToStorage(userToken);

    // Registra el push token después de iniciar sesión
    try {
      await registerPushToken();
    } catch (error) {
      console.error('Error al registrar el push token:', error);
    }
  };

  // Cerrar sesión: elimina el token de Secure Storage y actualiza el estado
  const logout = async () => {
    setIsAuthenticated(false);
    setToken(null);
    setUser(null);
    await removeTokenFromStorage();
  };

  // Verificar el token al cargar la aplicación
  useEffect(() => {
    const checkSession = async () => {
      const storedToken = await getTokenFromStorage();
      if (storedToken) {
        setIsAuthenticated(true);
        setToken(storedToken);
        // Aquí puedes hacer una solicitud al backend para obtener la información del usuario si es necesario
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  // Proveer el contexto
  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
