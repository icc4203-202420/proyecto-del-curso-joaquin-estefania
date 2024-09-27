import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, List, ListItem, Typography, Button, Container } from '@mui/material';

function SearchUser() {
  const [query, setQuery] = useState(''); // Estado para la búsqueda de usuarios
  const [users, setUsers] = useState([]); // Lista de usuarios filtrados
  const [eventName, setEventName] = useState(''); // Estado para almacenar el nombre del evento ingresado

  // Efecto para buscar usuarios basados en la consulta (handle)
  useEffect(() => {
    if (query.length > 2) {
      axios.get(`/api/v1/users/search?handle=${query}`)
        .then(response => {
          setUsers(response.data); // Almacena los usuarios encontrados en el estado
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
    } else {
      setUsers([]); // Si la consulta es menor a 3 caracteres, limpia la lista de usuarios
    }
  }, [query]);

  // Función para agregar amigo
  const handleAddFriend = (userId) => {
    const token = localStorage.getItem('token'); // Obtén el token JWT almacenado
  
    axios.post('/api/v1/friendships', {
      friend_id: userId,
      event_name: eventName || null // Envía el nombre del evento si fue ingresado, de lo contrario, envía null
    }, {
      headers: {
        Authorization: `Bearer ${token}` // Incluye el token JWT en la cabecera
      }
    })
    .then(response => {
      alert('Solicitud de amistad enviada.');
    })
    .catch(error => {
      console.error('Error adding friend:', error);
    });
  };

  return (
    <Container>
      <Typography variant="h4">Buscar Usuarios</Typography>
      
      {/* Campo de texto para buscar usuarios por su handle */}
      <TextField
        label="Buscar por handle"
        variant="outlined"
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)} // Actualiza la consulta de búsqueda
        margin="normal"
      />
      
      {/* Campo de texto opcional para ingresar el nombre del evento */}
      <TextField
        label="Nombre del evento donde se conocieron (opcional)"
        variant="outlined"
        fullWidth
        value={eventName}
        onChange={(e) => setEventName(e.target.value)} // Actualiza el nombre del evento
        margin="normal"
      />

      {/* Lista de usuarios filtrados */}
      <List>
        {users.length > 0 ? (
          users.map((user) => (
            <ListItem key={user.id}>
              <Typography variant="body1">
                {user.first_name} {user.last_name} - @{user.handle} ({user.email})
              </Typography>
              {/* Botón para agregar amigo */}
              <Button variant="contained" color="primary" onClick={() => handleAddFriend(user.id)}>
                Agregar como amigo
              </Button>
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            No se encontraron usuarios.
          </Typography>
        )}
      </List>
    </Container>
  );
}

export default SearchUser;
