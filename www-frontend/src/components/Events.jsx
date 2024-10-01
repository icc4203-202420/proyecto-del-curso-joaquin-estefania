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

  const handleCheckIn = (eventId) => {
    console.log("ID del evento:", eventId);  // Imprimir el id en la consola

    // Recupera el token desde el localStorage
    const token = localStorage.getItem('token');

    // Solicitud POST para hacer check-in
    axios.post(`/api/v1/events/${eventId}/attend`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      console.log("Respuesta del servidor:", response.data); // Imprimir la respuesta
      // Actualiza los eventos para incluir al nuevo asistente
      setEvents(prevEvents =>
        prevEvents.map(event => {
          if (event.id === eventId) {
            // Agregar el nuevo usuario a la lista de asistencias
            return {
              ...event,
              attendances: [
                ...event.attendances,
                {
                  user: {
                    id: response.data.user_id, // Suponiendo que el servidor devuelve el ID del usuario
                    first_name: response.data.first_name, // Suponiendo que el servidor devuelve el nombre
                    last_name: response.data.last_name // Suponiendo que el servidor devuelve el apellido
                  }
                }
              ]
            };
          }
          return event;
        })
      );
    })
    .catch(error => {
      console.error('Error checking in:', error);
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
