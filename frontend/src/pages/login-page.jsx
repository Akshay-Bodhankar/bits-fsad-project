import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import axios from 'axios';

function LoginPage() {
  const navigate = useNavigate();
  
  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    const body = {
      "userName": values.username,
      "password": values.password
    }
    try {
      const { data } = await axios.post('/api/login', body);

      // Store token and role in sessionStorage
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('role', data.role);

      // Navigate to dashboard on success
      navigate('/dashboard');
    } catch (error) {
      setFieldError('password', error.response?.data?.message || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <header className='border-b py-4'>
        <h1 className='text-3xl text-center'>Vaccine Management</h1>
      </header>
      <div className='max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className='space-y-4'>
              <div>
                <label htmlFor='username' className='block mb-1 font-medium'>Username</label>
                <Field
                  type='text'
                  name='username'
                  id='username'
                  className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <ErrorMessage name='username' component='div' className='text-red-500 text-sm mt-1' />
              </div>
              
              <div>
                <label htmlFor='password' className='block mb-1 font-medium'>Password</label>
                <Field
                  type='password'
                  name='password'
                  id='password'
                  className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <ErrorMessage name='password' component='div' className='text-red-500 text-sm mt-1' />
              </div>
              
              <button
                type='submit'
                disabled={isSubmitting}
                className='w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300'
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default LoginPage;
