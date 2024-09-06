import React, { useState } from 'react';
import { Container, TextField, Button } from '@mui/material';

function SearchUser() {
  const [handle, setHandle] = useState('');

  // Función que se ejecutará al hacer clic en el botón "Buscar"
  const handleSearch = () => {
    console.log(`Buscando usuario con handle: ${handle}`);
    // Aquí puedes hacer una llamada a la API en el futuro
  };

  return (
    <Container>
      <TextField 
        label="Buscar usuario por handle" 
        variant="outlined" 
        fullWidth 
        value={handle}
        onChange={(e) => setHandle(e.target.value)} 
        margin="normal"
      />
      <Button 
        variant="contained" 
        color="primary"
        onClick={handleSearch} 
      >
        Buscar
      </Button>
    </Container>
  );
}

export default SearchUser;
