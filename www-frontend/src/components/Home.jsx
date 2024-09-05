import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <Container>
      <Typography variant="h3">Bienvenido a la App de Cervezas</Typography>
      <Button component={Link} to="/beers" variant="contained">Ver Cervezas</Button>
      <Button component={Link} to="/bars" variant="contained">Ver Bares</Button>
    </Container>
  );
}

export default Home;
