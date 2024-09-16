import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import axios from 'axios';

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [bars, setBars] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const mapNodeRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Cargar Google Maps API
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places'], // Incluye la biblioteca de lugares si necesitas funcionalidades adicionales
    });

    loader.load().then(() => {
      console.log('Google Maps API loaded');
      const map = new google.maps.Map(mapNodeRef.current, {
        center: { lat: -31.56391, lng: 147.154312 }, // Centro inicial del mapa
        zoom: 7,
      });
      setMap(map);
    }).catch(error => {
      console.error('Error loading Google Maps API:', error);
    });
  }, []);

  useEffect(() => {
    if (!map) return;
  
    // Buscar bares en el backend cuando cambia la consulta de búsqueda
    const fetchBars = async () => {
      try {
        const response = await axios.get('/api/v1/bars');
        const barsData = response.data.bars;
        console.log('Fetched bars:', barsData);
        
        // Si hay una consulta de búsqueda, filtra los bares por nombre
        const filteredBars = barsData.filter(bar => 
          bar.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
  
        setBars(filteredBars);
  
        // Si hay bares filtrados, centramos y hacemos zoom en el primer bar
        if (filteredBars.length > 0) {
          const firstBar = filteredBars[0];
          map.setCenter({ lat: firstBar.latitude, lng: firstBar.longitude });
          map.setZoom(14); // Ajusta el zoom como desees, 14 es un buen nivel de detalle
        }
  
      } catch (error) {
        console.error('Error fetching bars:', error);
      }
    };
  
    fetchBars();
  }, [searchQuery, map]);
  

  useEffect(() => {
    if (!map || !Array.isArray(bars) || bars.length === 0) return;

    // Limpiar los marcadores existentes
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Agregar nuevos marcadores
    const newMarkers = bars.map(bar => {
      const marker = new google.maps.Marker({
        position: { lat: bar.latitude, lng: bar.longitude },
        map,
        title: bar.name,
      });
      markersRef.current.push(marker);
      return marker;
    });

    console.log('Markers added:', newMarkers); // Verifica los marcadores añadidos

    return () => {
      // Limpiar los marcadores en caso de que el componente se desmonte
      markersRef.current.forEach(marker => marker.setMap(null));
    };
  }, [bars, map]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar bares..."
        value={searchQuery}
        onChange={handleSearch}
      />
      <div
        ref={mapNodeRef}
        style={{ width: '100vw', height: '100vh' }}
      />
    </div>
  );
};

export default MapComponent;
