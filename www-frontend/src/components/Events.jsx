import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, List, ListItem, Typography } from '@mui/material';

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

  return (
    <Container>
      <Typography variant="h4">Eventos en el bar</Typography>
      <List>
        {events.map(event => (
          <ListItem key={event.id}>
            <Typography variant="h6">{event.name}</Typography>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default Events;
