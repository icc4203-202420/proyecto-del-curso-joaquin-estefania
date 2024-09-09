import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box } from '@mui/material';
import axios from 'axios';

const RateSubmit = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Cambiado a 'id' en lugar de 'beerId'

  const validationSchema = Yup.object().shape({
    rating: Yup.number()
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating cannot be more than 5')
      .required('Rating is required'),
    text: Yup.string()
      .min(15, 'Review must be at least 15 words')
      .required('Review text is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.post(`/api/v1/beers/${id}/reviews`, { // Asegúrate de usar 'id'
        review: {
          rating: values.rating,
          text: values.text,
        },
      });
      alert('Review submitted successfully!');
      navigate(`/beers/${id}`);
    } catch (error) {
      alert('Failed to submit review: ' + error.message);
    } finally {
      setSubmitting(false);
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
