import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Importa useNavigate
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button'; 

const BeerDetails = () => {
  const { id } = useParams();
  const [beer, setBeer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null); // Estado para la reseña seleccionada
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const reviewsPerPage = 5;
  const navigate = useNavigate(); // Navegador de react-router

  useEffect(() => {
    const fetchBeerDetails = async () => {
      try {
        const response = await axios.get(`/api/v1/beers/${id}`);
        setBeer(response.data.beer);
      } catch (error) {
        console.error('Error fetching beer details:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/api/v1/beers/${id}/reviews?page=${page}&limit=${reviewsPerPage}`);
        setReviews(response.data.reviews);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };    

    fetchBeerDetails();
    fetchReviews();
  }, [id, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRateButtonClick = () => {
    navigate(`/beers/${id}/rate`); // Navega a la ruta de creación de reseñas
  };

  const handleReviewClick = (review) => {
    setSelectedReview(review); // Asigna la reseña seleccionada
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
        </CardContent>
      </Card>

      <Typography variant="h6" sx={{ mt: 3 }}>Reviews:</Typography>
      <List>
        {reviews.map((review) => (
          <ListItem key={review.id} alignItems="flex-start">
            <ListItemText
              primary={`Rating: ${review.rating}`}
              secondary={
                <>
                  {review.text}
                  <br />
                  <Typography variant="body2" color="textSecondary">
                    User: {review.user ? review.user.handle : 'Unknown User'}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>


      {/* Botón para redirigir a la creación de reseña */}
      {!selectedReview && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleRateButtonClick}
        >
          Rate this Beer
        </Button>
      )}

      {/* Mostrar la reseña seleccionada */}
      {selectedReview && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6">Selected Review</Typography>
            <Typography variant="body1">
              {selectedReview.text}
            </Typography>
            <Typography variant="body2">
              Rating: {selectedReview.rating}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default BeerDetails;
