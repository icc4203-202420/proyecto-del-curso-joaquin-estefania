import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Importa useNavigate junto con useParams
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Button } from '@mui/material';

const BeerDetails = () => {
  const { id } = useParams();
  const [beer, setBeer] = useState(null);
  const [bars, setBars] = useState([]);
  const navigate = useNavigate(); 

  const handleRateBeer = () => {
    navigate(`/beers/${beer.id}/rate`);
  };

  useEffect(() => {
    const fetchBeerDetails = async () => {
      try {
        const response = await axios.get(`/api/v1/beers/${id}`);
        setBeer(response.data.beer);
        setBars(response.data.bars || []);
      } catch (error) {
        console.error('Error fetching beer details:', error);
      }
    };

    fetchBeerDetails();
  }, [id]);

  if (!beer) return <Typography>Loading...</Typography>;

  return (
    <Container>
      <Card>
        <CardMedia
          component="img"
          height="300"
          image={beer.image}
          alt={beer.name}
        />
        <CardContent>
          <Typography variant="h5">{beer.name}</Typography>
          <Typography variant="body1">Type: {beer.type}</Typography>
          <Typography variant="body1">Style: {beer.style}</Typography>
          <Typography variant="body1">Hop: {beer.hop}</Typography>
          <Typography variant="body1">Yeast: {beer.yeast}</Typography>
          <Typography variant="body1">Malts: {beer.malts}</Typography>
          <Typography variant="body1">IBU: {beer.ibu}</Typography>
          <Typography variant="body1">Alcohol: {beer.alcohol}</Typography>
          <Typography variant="body1">BLG: {beer.blg}</Typography>
          <Typography variant="body1">Avg Rating: {beer.avg_rating}</Typography>
        </CardContent>
      </Card>
      <Button variant="contained" color="primary" onClick={handleRateBeer} sx={{ mt: 2 }}>
        Rate this Beer
      </Button>
      <Typography variant="h6" sx={{ mt: 2 }}>Available at Bars:</Typography>
      <List>
        {bars.map((bar) => (
          <ListItem key={bar.id}>
            <ListItemText primary={bar.name} secondary={bar.address} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default BeerDetails;
