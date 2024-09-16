import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Home from './components/Home';
import BeerList from './components/BeerList';
import BeerDetails from './components/BeerDetails'; 
import BarList from './components/BarList';
import Events from './components/Events';
import SearchUser from './components/SearchUser';
import RegistrationForm from './components/SignUp';
import LoginForm from './components/Login';
import RateSubmit from './components/RateSubmit';
import MapComponent from './components/MapComponent';

function App() {
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setUser(user);
    localStorage.setItem('token', user.token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
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
          path="/beers/:id"
          element={user ? <BeerDetails /> : <Navigate to="/login" />}
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
        path="/beers/:id/rate" 
        element={user ? <RateSubmit /> : <Navigate to="/login" />}
        />
        <Route
          path="/search"
          element={user ? <SearchUser /> : <Navigate to="/login" />}
        />
        <Route
          path="/map"
          element={user ? <MapComponent /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
