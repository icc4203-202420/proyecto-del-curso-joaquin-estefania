import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, List, ListItem, Typography, Button, ListItemText } from '@mui/material';

function Events() {
  const { id } = useParams(); // Obtener el ID del bar de la URL
  const [events, setEvents] = useState([]); // Estado para almacenar los eventos

  // Hook useEffect para hacer la solicitud cuando el componente se monta o cambia el id
  useEffect(() => {
    // Solicitud GET al backend para obtener los eventos de un bar en particular
    axios.get(`/api/v1/bars/${id}/events`).then((response) => {
      setEvents(response.data.events); // Actualiza el estado con los eventos recibidos
    }).catch((error) => {
      console.error("Error fetching events:", error); // Manejar posibles errores
    });
  }, [id]); // El efecto se ejecutará cada vez que cambie el id del bar

// Parte del código del componente Events
const handleCheckIn = (eventId) => {
  axios.post(`/api/v1/events/${eventId}/attend`)
    .then((response) => {
      console.log(response.data.message); // Mensaje de éxito
      // Actualizar el estado si es necesario para reflejar la asistencia
    })
    .catch((error) => {
      console.error("Error checking in:", error.response.data.message); // Manejar errores
    });
};

// Agregar el botón en el renderizado de eventos
<List>
  {events.map(event => (
    <ListItem key={event.id}>
      <Typography variant="h6">{event.name}</Typography>
      <button onClick={() => handleCheckIn(event.id)}>Check-in</button>
    </ListItem>
  ))}
</List>

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
