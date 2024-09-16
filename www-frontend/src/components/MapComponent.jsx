import { useState, useEffect } from 'react';
import axios from 'axios';

const MapComponent = () => {
  const [bars, setBars] = useState([]);
  const [map, setMap] = useState(null);
  const [googleLoaded, setGoogleLoaded] = useState(false); // Para saber cuándo Google Maps se ha cargado
  const [searchParams, setSearchParams] = useState({
    city: '',
    line1: '',
    line2: '',
    country_id: ''
  });

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Cargar el SDK de Google Maps de forma dinámica
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setGoogleLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => setGoogleLoaded(true); // Marcar como cargado cuando el script termine de cargar
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, [googleMapsApiKey]);

  // Inicializar el mapa una vez que Google Maps esté cargado
  useEffect(() => {
    if (googleLoaded && !map) {
      const mapOptions = {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
      };

      const newMap = new window.google.maps.Map(document.getElementById('map'), mapOptions);
      setMap(newMap);
    }
  }, [googleLoaded, map]);

  // Manejar cambios en los campos de búsqueda
  const handleInputChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  // Buscar los bares por ubicación
  const fetchBars = async () => {
    try {
      const response = await axios.get('/api/v1/bars', { params: searchParams });
      const barsData = response.data.bars;
      setBars(barsData);

      if (barsData.length > 0 && map) {
        const firstBar = barsData[0];
        map.setCenter({ lat: firstBar.latitude, lng: firstBar.longitude });
        map.setZoom(14); // Ajustar el zoom según necesidad

        // Agregar marcadores al mapa
        barsData.forEach(bar => {
          new window.google.maps.Marker({
            position: { lat: bar.latitude, lng: bar.longitude },
            map: map,
            title: bar.name
          });
        });
      }
    } catch (error) {
      console.error('Error fetching bars:', error);
    }
  };

  useEffect(() => {
    if (map) {
      fetchBars();
    }
  }, [searchParams, map]);

  return (
    <div>
      <div>
        <input 
          type="text" 
          name="city" 
          placeholder="City" 
          value={searchParams.city} 
          onChange={handleInputChange} 
        />
        <input 
          type="text" 
          name="line1" 
          placeholder="Street (line 1)" 
          value={searchParams.line1} 
          onChange={handleInputChange} 
        />
        <input 
          type="text" 
          name="line2" 
          placeholder="Street (line 2)" 
          value={searchParams.line2} 
          onChange={handleInputChange} 
        />
        <input 
          type="number" 
          name="country_id" 
          placeholder="Country ID" 
          value={searchParams.country_id} 
          onChange={handleInputChange} 
        />
        <button onClick={fetchBars}>Search</button>
      </div>
      
      <div id="map" style={{ height: '400px', width: '100%' }}></div>
    </div>
  );
};

export default MapComponent;
