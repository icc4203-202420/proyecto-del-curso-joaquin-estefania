import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import BeerList from './components/BeerList';
import BarList from './components/BarList';
import Events from './components/Events';
import SearchUser from './components/SearchUser';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/beers" element={<BeerList />} />
        <Route path="/bars" element={<BarList />} />
        <Route path="/bars/:id/events" element={<Events />} /> {/* Ruta para eventos */}
        <Route path="/search" element={<SearchUser />} />
      </Routes>
    </Router>
  );
}

export default App;
