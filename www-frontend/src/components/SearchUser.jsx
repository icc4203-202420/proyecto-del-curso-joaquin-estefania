import React, { useState } from 'react';
import { Container, TextField, Button } from '@mui/material';

function SearchUser() {
  const [handle, setHandle] = useState('');

  return (
    <Container>
      <TextField 
        label="Buscar usuario por handle" 
        variant="outlined" 
        fullWidth 
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
      />
      <Button variant="contained" color="primary">Buscar</Button>
    </Container>
  );
}

export default SearchUser;
