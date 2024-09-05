import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, List, ListItem, Typography } from '@mui/material';

function Events() {
  const { id } = useParams();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get(`/api/v1/bar/${id}/events`).then((response) => {
      setEvents(response.data);
    });
  }, [id]); 

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
