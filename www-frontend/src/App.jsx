import React, { useState } from 'react';
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

  const handleLoginSuccess = (user) => {
    setUser(user); // Guarda la información del usuario en el estado
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
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
