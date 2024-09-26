import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, List, ListItem, Typography, Button, Container } from '@mui/material';

function SearchUser() {
  const [query, setQuery] = useState(''); // Estado para el valor del campo de búsqueda
  const [users, setUsers] = useState([]); // Estado para almacenar los usuarios filtrados
  const [selectedBar, setSelectedBar] = useState(''); // Estado para almacenar el bar donde se conocieron

  useEffect(() => {
    if (query.length > 2) {
      axios.get(`/api/v1/users/search?handle=${query}`)  // Cambia `query` por `handle`
        .then(response => {
          setUsers(response.data); // Actualiza el estado con los usuarios encontrados
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
    } else {
      setUsers([]); // Vacía la lista si la consulta es menor a 3 caracteres
    }
  }, [query]);

  const handleAddFriend = (userId) => {
    axios.post('/api/v1/friendships', {
      friend_id: userId, // El usuario que queremos agregar
      bar_id: selectedBar || null // Opcional: el evento/bar donde se encontraron
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
      <TextField
        label="Buscar por handle"
        variant="outlined"
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)} // Actualiza el estado con el valor del input
        margin="normal"
      />
      
      {/* Campo opcional para seleccionar un evento/bar */}
      <TextField
        label="Bar donde se conocieron (opcional)"
        variant="outlined"
        fullWidth
        value={selectedBar}
        onChange={(e) => setSelectedBar(e.target.value)} // Actualiza el estado del bar seleccionado
        margin="normal"
      />

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
