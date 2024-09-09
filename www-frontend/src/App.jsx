import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Home from './components/Home';
import BeerList from './components/BeerList';
import BarList from './components/BarList';
import Events from './components/Events';
import SearchUser from './components/SearchUser';
import RegistrationForm from './components/SignUp';
import LoginForm from './components/Login';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verifica si hay un token en localStorage al iniciar el componente
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
      } catch (error) {
        // Si el token no es válido, elimina el token y reinicia el estado
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setUser(user); // Guarda la información del usuario en el estado
    localStorage.setItem('token', user.token); // Guarda el token en localStorage
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token del localStorage
    setUser(null); // Limpia el estado del usuario
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Home onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!user ? <LoginForm onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!user ? <RegistrationForm /> : <Navigate to="/" />}
        />
        <Route
          path="/beers"
          element={user ? <BeerList /> : <Navigate to="/login" />}
        />
        <Route
          path="/bars"
          element={user ? <BarList /> : <Navigate to="/login" />}
        />
        <Route
          path="/bars/:id/events"
          element={user ? <Events /> : <Navigate to="/login" />}
        />
        <Route
          path="/search"
          element={user ? <SearchUser /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
