import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import PublicWrapper from '../../layouts/Public';
import Validations from '../../utils/Validations';
import { login } from '../../services/Auth';
import useToastr from '../../hooks/useToastr';
import RoutePaths from '../../configs/Routes';

const Login = () => {
  const { control, handleSubmit } = useForm();
  const history = useHistory();
  const { showSuccessToastr, showErrorToastr } = useToastr();

  const [processing, setProcessing] = useState(false);

  const onSubmit = async (data) => {
    setProcessing(true);
    try {
      const result = await login(data);
      if (result.success) {
        showSuccessToastr('Logged in successfully.');
        window.localStorage.setItem('isLoggedIn', true);
        window.location.assign(RoutePaths.HOME);
      }
      setProcessing(false);
    } catch (error) {
      showErrorToastr(error?.response?.data?.message || error?.message || 'Something went wrong.');
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn')) {
      history.replace(RoutePaths.HOME);
    }
  }, []);

  return (
    <PublicWrapper>
      <Box
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
          <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
            <Typography variant="h5" gutterBottom>
              Login
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} data-testid="login-form">
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    id="email"
                    name="email"
                    rules={{ ...Validations.REQUIRED }}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        required
                        id="email"
                        name="email"
                        inputProps={{
                          'data-testid': 'login-form-email',
                        }}
                        label="Email"
                        fullWidth
                        variant="standard"
                        type="email"
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    id="password"
                    name="password"
                    rules={{ ...Validations.REQUIRED }}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        required
                        id="password"
                        name="password"
                        inputProps={{
                          'data-testid': 'login-form-password',
                        }}
                        label="Password"
                        fullWidth
                        variant="standard"
                        type="password"
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    data-testid="login-form-submit-btn"
                    endIcon={processing && <CircularProgress color="secondary" size={18} />}
                    disabled={processing}
                  >
                    {processing ? 'Logging in' : 'Login'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Box>
    </PublicWrapper>
  );
};

export default Login;
