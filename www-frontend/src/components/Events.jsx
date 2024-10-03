import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, List, ListItem, Typography, Button, ListItemText, Grid } from '@mui/material';

function Events() {
  const { id } = useParams(); // Obtener el ID del bar de la URL
  const [events, setEvents] = useState([]); // Estado para almacenar los eventos
  const [eventPictures, setEventPictures] = useState([]); // Estado para almacenar las imágenes del evento
  const inputFiles = useRef(); // Referencia para el input de archivos
  const [selectedFiles, setSelectedFiles] = useState([]); // Estado para almacenar los archivos seleccionados
  const [imagePreviews, setImagePreviews] = useState([]); // Estado para almacenar las URLs de las imágenes

  // Hook useEffect para hacer la solicitud cuando el componente se monta o cambia el id
  useEffect(() => {
    // Solicitud GET al backend para obtener los eventos de un bar en particular
    axios.get(`/api/v1/bars/${id}/events`).then((response) => {
      setEvents(response.data.events); // Actualiza el estado con los eventos recibidos
      const pictures = response.data.events.flatMap(event => event.event_pictures || []);
      setEventPictures(pictures); // Guarda las imágenes del evento
    }).catch((error) => {
      console.error("Error fetching events:", error); // Manejar posibles errores
    });
  }, [id]);

  const handleFileChange = () => {
    const files = inputFiles.current.files;
    console.log(files); // Aquí puedes ver los archivos adjuntados

    // Crear un array de URLs de las imágenes seleccionadas para mostrar la vista previa
    const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
    setImagePreviews(imageUrls); // Almacenar las URLs en el estado para mostrar la vista previa
    setSelectedFiles(files); // Actualizar el estado con los archivos seleccionados
  };

  const handleUploadPhoto = (eventId) => {
    if (!selectedFiles.length) return;  // Verifica si hay archivos seleccionados
  
    const formData = new FormData();
    Array.from(selectedFiles).forEach(file => {
      formData.append('event_picture[image][]', file);  // Para múltiples archivos
    });
  
    const token = localStorage.getItem('token');  // Recupera el token
  
    axios.post(`/api/v1/events/${eventId}/event_pictures`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      console.log("Imagen subida con éxito:", response.data);
      alert("Imagen subida con éxito");

      // Recargar las imágenes del evento después de subir
      axios.get(`/api/v1/bars/${id}/events`).then((response) => {
        setEventPictures(response.data.events.flatMap(event => event.event_pictures || []));
      });
    })
    .catch(error => {
      console.error('Error al subir la(s) imagen(es):', error);
      alert('Error al subir la(s) imagen(es)');
    });
  };

  return (
    <Container>
      <Typography variant="h4">Eventos en el bar</Typography>
      <List>
        {events.map(event => (
          <ListItem key={event.id}>
            <ListItemText
              primary={<Typography variant="h6">{event.name}</Typography>}
              secondary={
                <>
                  <Typography variant="body2">Asistentes:</Typography>
                  <List>
                    {event.attendances.map(attendance => (
                      <ListItem key={attendance.user.id}>
                        <Typography variant="body2">{attendance.user.first_name} {attendance.user.last_name}</Typography>
                      </ListItem>
                    ))}
                  </List>
                  <Typography variant="body2">Subir una foto al evento:</Typography>
                  <input ref={inputFiles} type="file" multiple onChange={handleFileChange} accept="image/*" />
                  <Button variant="contained" color="secondary" onClick={() => handleUploadPhoto(event.id)}>
                    Subir Foto(s)
                  </Button>

                  {/* Mostrar las vistas previas de las imágenes seleccionadas */}
                  <Grid container spacing={2}>
                    {imagePreviews.map((url, index) => (
                      <Grid item xs={3} key={index}>
                        <img src={url} alt={`Vista previa ${index}`} style={{ width: '100%', height: 'auto' }} />
                      </Grid>
                    ))}
                  </Grid>

                  {/* Mostrar imágenes subidas del evento en miniaturas */}
                  <Grid container spacing={2}>
                    {eventPictures.filter(pic => pic.event_id === event.id).map(picture => (
                      <Grid item xs={3} key={picture.id}>
                        <img src={picture.image_url} alt="Event Picture" style={{ width: '100%', height: 'auto' }} />
                      </Grid>
                    ))}
                  </Grid>
                </>
              }
            />
            <Button variant="contained" color="primary" onClick={() => handleCheckIn(event.id)}>
              Check-in
            </Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default Events;
