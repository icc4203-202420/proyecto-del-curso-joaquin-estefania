import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box } from '@mui/material';
import axios from 'axios';

const RateSubmit = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Se obtiene el ID de la cerveza desde la URL

  // Esquema de validación para los campos del formulario
  const validationSchema = Yup.object().shape({
    rating: Yup.number()
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating cannot be more than 5')
      .required('Rating is required'),
    text: Yup.string()
      .min(15, 'Review must be at least 15 characters long')
      .required('Review text is required'),
  });

  // Maneja el envío del formulario
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found.');
      }

      // Enviar el POST request con los datos de la reseña
      await axios.post(`/api/v1/beers/${id}/reviews`, {
        review: {
          rating: values.rating,
          text: values.text,
        },
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Autorización JWT
        },
      });

      alert('Review submitted successfully!');
      resetForm(); // Reinicia el formulario
      navigate(`/beers/${id}`); // Redirige a la página de la cerveza

    } catch (error) {
      alert('Failed to submit review: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false); // Indica que la acción ha finalizado
    }
  };

  return (
    <Formik
      initialValues={{ rating: '', text: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form>
          <Box sx={{ mt: 3 }}>
            <Field
              as={TextField}
              name="rating"
              label="Rating (1-5)"
              fullWidth
              error={touched.rating && Boolean(errors.rating)}
              helperText={touched.rating && errors.rating}
            />
            <Field
              as={TextField}
              name="text"
              label="Review"
              fullWidth
              multiline
              rows={4}
              error={touched.text && Boolean(errors.text)}
              helperText={touched.text && errors.text}
              sx={{ mt: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{ mt: 2 }}
            >
              Submit Review
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default RateSubmit;
