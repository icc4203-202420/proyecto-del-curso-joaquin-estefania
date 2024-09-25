import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import axios from 'axios';
import TextField from '@mui/material/TextField'; // Importar el componente TextField

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [bars, setBars] = useState([]); // Bares cargados desde el backend
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
  const mapNodeRef = useRef(null);
  const markersRef = useRef([]);
  const autocompleteRef = useRef(null);
  const geocoderRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places'], // Cargar la biblioteca de Places para autocompletado
    });

    loader.load().then(() => {
      console.log('Google Maps API loaded');
      const map = new google.maps.Map(mapNodeRef.current, {
        center: { lat: -31.56391, lng: 147.154312 },
        zoom: 7,
      });
      setMap(map);

      // Inicializar el servicio de geocodificación
      geocoderRef.current = new google.maps.Geocoder();

      // Inicializar el autocompletado
      const input = document.getElementById('autocomplete');
      autocompleteRef.current = new google.maps.places.Autocomplete(input);
      autocompleteRef.current.bindTo('bounds', map);

      autocompleteRef.current.addListener('place_changed', async () => {
        const place = autocompleteRef.current.getPlace();
        if (!place.geometry || !place.geometry.location) {
          console.error("No details available for input: '" + place.name + "'");
          return;
        }

        // Centrar el mapa en la ubicación seleccionada
        const location = place.geometry.location;
        map.setCenter(location);
        map.setZoom(12);

        // Obtener bares desde el backend
        fetchBarsAndSet(); // Obtener y mostrar todos los bares
      });

      // Geolocalización del usuario
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userPos = { lat: latitude, lng: longitude };
          map.setCenter(userPos);
          map.setZoom(12);

          new google.maps.Marker({
            position: userPos,
            map,
            title: "Your Location",
            icon: {
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            },
          });

          // Obtener bares desde el backend
          fetchBarsAndSet(); // Obtener y mostrar todos los bares
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }).catch(error => {
      console.error('Error loading Google Maps API:', error);
    });
  }, []);

  const fetchBars = async () => {
    try {
      const response = await axios.get('/api/v1/bars');
      return response.data.bars;
    } catch (error) {
      console.error('Error fetching bars:', error);
      return [];
    }
  };

  const fetchBarsAndSet = async () => {
    const allBars = await fetchBars();
    setBars(allBars); // Establecer todos los bares
  };

  // Filtrar bares por nombre
  const filteredBars = bars.filter(bar => bar.name.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    if (!map || !Array.isArray(filteredBars) || filteredBars.length === 0) return;

    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const newMarkers = filteredBars.map(bar => {
      const marker = new google.maps.Marker({
        position: { lat: bar.latitude, lng: bar.longitude },
        map,
        title: bar.name,
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // Marcadores rojos para los bares
        },
      });
      markersRef.current.push(marker);
      return marker;
    });

    // Zoom en el primer bar filtrado si existe
    const firstFilteredBar = filteredBars[0];
    if (firstFilteredBar) {
      const { latitude, longitude } = firstFilteredBar;
      map.setCenter({ lat: latitude, lng: longitude });
      map.setZoom(12); // Ajusta el nivel de zoom según sea necesario
    }

    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
    };
  }, [filteredBars, map]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <TextField
        variant="outlined" // Puedes cambiar a "filled" o "standard" si lo prefieres
        label="Buscar bares por nombre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Actualizar el término de búsqueda
        style={{
          marginBottom: '10px',
          width: '90%',
          maxWidth: '500px',
        }}
      />
      <div
        ref={mapNodeRef}
        style={{
          width: '90vw', 
          height: '500px', 
          border: '1px solid black', 
          margin: '0 auto' 
        }}
      />
    </div>
  );
};

export default MapComponent;
