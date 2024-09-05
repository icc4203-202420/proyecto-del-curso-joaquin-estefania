import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

const ListBeers = () => {
  const [beers, setBeers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBeers = async () => {
      try {
        const response = await axios.get('/api/v1/beers');
        setBeers(response.data.beers);
        setLoading(false);
      } catch (err) {
        setError('Error fetching beers');
        setLoading(false);
      }
    };

    fetchBeers();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Beers List
      </Typography>
      <List>
        {beers.map((beer) => (
          <ListItem key={beer.id}>
            <ListItemText
              primary={beer.name}
              secondary={
                <>
                  <Typography variant="body2">Style: {beer.style}</Typography>
                  <Typography variant="body2">Hop: {beer.hop}</Typography>
                  <Typography variant="body2">Yeast: {beer.yeast}</Typography>
                  <Typography variant="body2">Malts: {beer.malts}</Typography>
                  <Typography variant="body2">IBU: {beer.ibu}</Typography>
                  <Typography variant="body2">Alcohol: {beer.alcohol}</Typography>
                  <Typography variant="body2">BLG: {beer.blg}</Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ListBeers;
