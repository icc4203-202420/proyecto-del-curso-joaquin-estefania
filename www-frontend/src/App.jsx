import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
        const decodedToken = jwt_decode(token);
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

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <LoginForm onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" />} />
        <Route path="/signup" element={<RegistrationForm />} />
        <Route path="/beers" element={<BeerList />} />
        <Route path="/bars" element={<BarList />} />
        <Route path="/bars/:id/events" element={<Events />} />
        <Route path="/search" element={<SearchUser />} />
      </Routes>
    </Router>
  );
}

export default App;
