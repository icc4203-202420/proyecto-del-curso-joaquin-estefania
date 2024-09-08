import React from 'react';
import { TextField, Button, Box, Grid, Typography } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import useAxios from 'axios-hooks';

const SignUpForm = () => {
  const [, executePost] = useAxios(
    {
      url: '/api/v1/signup',
      method: 'POST',
    },
    { manual: true }
  );

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    handle: Yup.string().required('Handle is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Password confirmation is required'),
    age: Yup.number().optional(),
    address: Yup.object().shape({
      line1: Yup.string().optional(),
      line2: Yup.string().optional(),
      city: Yup.string().optional(),
      country: Yup.string().optional(),
    }),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await executePost({
        data: {
          user: {
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            handle: values.handle,
            password: values.password,
            password_confirmation: values.password_confirmation,
            age: values.age,
            address_attributes: values.address,
          },
        },
      });
      alert('Signed up successfully!');
      resetForm();
    } catch (error) {
      alert('Failed to sign up: ' + error.response.data.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        first_name: '',
        last_name: '',
        email: '',
        handle: '',
        password: '',
        password_confirmation: '',
        age: '',
        address: {
          line1: '',
          line2: '',
          city: '',
          country: '',
        },
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form>
          <Box sx={{ mt: 3 }}>
            <Typography variant="h4" gutterBottom>
              Sign Up
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name="first_name"
                  label="First Name"
                  fullWidth
                  error={touched.first_name && Boolean(errors.first_name)}
                  helperText={touched.first_name && errors.first_name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name="last_name"
                  label="Last Name"
                  fullWidth
                  error={touched.last_name && Boolean(errors.last_name)}
                  helperText={touched.last_name && errors.last_name}
                />
              </Grid>
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
                  name="handle"
                  label="Handle"
                  fullWidth
                  error={touched.handle && Boolean(errors.handle)}
                  helperText={touched.handle && errors.handle}
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
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="password_confirmation"
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  error={touched.password_confirmation && Boolean(errors.password_confirmation)}
                  helperText={touched.password_confirmation && errors.password_confirmation}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="age"
                  label="Age"
                  type="number"
                  fullWidth
                  error={touched.age && Boolean(errors.age)}
                  helperText={touched.age && errors.age}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="address.line1"
                  label="Address Line 1"
                  fullWidth
                  error={touched.address?.line1 && Boolean(errors.address?.line1)}
                  helperText={touched.address?.line1 && errors.address?.line1}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="address.line2"
                  label="Address Line 2"
                  fullWidth
                  error={touched.address?.line2 && Boolean(errors.address?.line2)}
                  helperText={touched.address?.line2 && errors.address?.line2}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="address.city"
                  label="City"
                  fullWidth
                  error={touched.address?.city && Boolean(errors.address?.city)}
                  helperText={touched.address?.city && errors.address?.city}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="address.country"
                  label="Country"
                  fullWidth
                  error={touched.address?.country && Boolean(errors.address?.country)}
                  helperText={touched.address?.country && errors.address?.country}
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
                Sign Up
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default SignUpForm;
