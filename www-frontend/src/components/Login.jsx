import React from 'react';
import { TextField, Button, Box, Grid, Typography } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import useAxios from 'axios-hooks';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const [, executePost] = useAxios(
    {
      url: '/api/v1/login',
      method: 'POST',
    },
    { manual: true }
  );

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await executePost({
        data: {
          user: {
            email: values.email,
            password: values.password,
          },
        },
      });

      if (response.data && response.data.status && response.data.status.code === 200) {
        const token = response.data.status.data.token;
        if (token) {
          localStorage.setItem('token', token);
          console.log(response.data)
          onLoginSuccess({ token }); // Llama a la función onLoginSuccess pasada como prop
          navigate('/'); // Redirige a la página de inicio
        } else {
          throw new Error('Token not found in response');
        }
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
      console.error('Response error:', error);
      alert('Failed to log in: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form>
          <Box sx={{ mt: 3 }}>
            <Typography variant="h4" gutterBottom>
              Login
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="email"
                  label="Email"
                  fullWidth
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate('/signup')}
                sx={{ ml: 2 }} // Espaciado entre los botones
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
