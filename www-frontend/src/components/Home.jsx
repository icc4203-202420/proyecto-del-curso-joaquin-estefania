import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button'; // Importa el componente Button
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';

const Home = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Llama a la función de logout pasada como prop
    navigate('/login'); // Redirige a la página de login
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Find perfect beers, in awesome places
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '20px' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardActionArea component={Link} to="/bars">
                <CardMedia
                  component="img"
                  alt="Bars"
                  height="140"
                  src="/images/bar.avif"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Bars
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardActionArea component={Link} to="/map">
                <CardMedia
                  component="img"
                  alt="Map"
                  height="140"
                  src="/images/map.png"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Map
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardActionArea component={Link} to="/events">
                <CardMedia
                  component="img"
                  alt="Events"
                  height="140"
                  src="/images/event.jpg"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Events
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardActionArea component={Link} to="/beers">
                <CardMedia
                  component="img"
                  alt="Beers"
                  height="140"
                  src="/images/beer.webp"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Beers
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardActionArea component={Link} to="/search">
                <CardMedia
                  component="img"
                  alt="Search User"
                  height="140"
                  src="/images/search-user.jpg"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Buscar Usuario
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Home;
