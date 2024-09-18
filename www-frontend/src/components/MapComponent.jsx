
import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import axios from 'axios';

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [bars, setBars] = useState([]);
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
        const allBars = await fetchBars();
        const filteredBars = filterBarsByCoordinates(allBars, location, 5000); // Filtrar bares dentro de 5km
        setBars(filteredBars);
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

  const filterBarsByCoordinates = (bars, center, radius) => {
    const radiusInKm = radius / 1000;

    return bars.filter(bar => {
      const barPos = new google.maps.LatLng(bar.latitude, bar.longitude);
      const centerPos = new google.maps.LatLng(center.lat(), center.lng());
      const distance = google.maps.geometry.spherical.computeDistanceBetween(barPos, centerPos);
      return distance <= radiusInKm * 1000; 
    });
  };

  useEffect(() => {
    if (!map || !Array.isArray(bars) || bars.length === 0) return;

    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const newMarkers = bars.map(bar => {
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

    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
    };
  }, [bars, map]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <input
        id="autocomplete"
        type="text"
        placeholder="Buscar por país, ciudad, calle, número..."
        style={{ 
          marginBottom: '10px', 
          padding: '5px', 
          width: '90%', 
          maxWidth: '500px', 
          borderRadius: '5px', 
          border: '1px solid #ccc' 
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
