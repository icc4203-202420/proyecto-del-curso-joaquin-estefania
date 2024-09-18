import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Pagination from '@mui/material/Pagination'; // Importa el componente de paginación de MUI

const BeerDetails = () => {
  const { id } = useParams(); // Obtener el ID de la cerveza desde la URL
  const [beer, setBeer] = useState(null);
  const [bars, setBars] = useState([]);
  const [reviews, setReviews] = useState([]); // Estado para las evaluaciones
  const [page, setPage] = useState(1); // Estado para la página actual
  const [totalPages, setTotalPages] = useState(1); // Estado para el total de páginas
  const reviewsPerPage = 5; // Número de evaluaciones por página

  useEffect(() => {
    // Función para obtener los detalles de la cerveza
    const fetchBeerDetails = async () => {
      try {
        const response = await axios.get(`/api/v1/beers/${id}`);
        setBeer(response.data.beer);
        setBars(response.data.bars || []);
      } catch (error) {
        console.error('Error fetching beer details:', error);
      }
    };

    // Función para obtener las evaluaciones con paginación
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/api/v1/beers/${id}/reviews?page=${page}&limit=${reviewsPerPage}`);
        setReviews(response.data.reviews);
        setTotalPages(response.data.totalPages); // Asume que el backend envía el número total de páginas
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchBeerDetails();
    fetchReviews();
  }, [id, page]);

  // Función para cambiar de página
  const handlePageChange = (event, value) => {
    setPage(value);
  };

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
          {/* Agrega otros detalles de la cerveza */}
        </CardContent>
      </Card>

      <Typography variant="h6" sx={{ mt: 2 }}>Reviews:</Typography>
      <List>
        {reviews.map((review) => (
          <ListItem key={review.id}>
            <ListItemText
              primary={`Rating: ${review.rating}`}
              secondary={review.text}
            />
          </ListItem>
        ))}
      </List>

      {/* Componente de paginación */}
      <Pagination
        count={totalPages} // Número total de páginas
        page={page} // Página actual
        onChange={handlePageChange} // Controlador de cambio de página
        color="primary"
        sx={{ mt: 2 }}
      />
    </Container>
  );
};

export default BeerDetails;
