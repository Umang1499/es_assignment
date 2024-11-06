import React from 'react';
import { useHistory } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import RoutePaths from '../configs/Routes';
import PublicWrapper from '../layouts/Public';

// 404 Page
const NotFound = () => {
  const pageName = '404';
  const history = useHistory();

  const handleClick = () => {
    history.push(RoutePaths.HOME);
  };

  return (
    <PublicWrapper>
      <Grid container spacing={0} align="center" justify="center" direction="column">
        <Container maxWidth="xs">
          <Container component="div">
            <Typography component="h1" variant="h1">
              {pageName}
            </Typography>
            <Typography component="p">The page you are looking for does not exist.</Typography>
          </Container>
          <Button variant="contained" color="primary" onClick={handleClick}>
            Back Home
          </Button>
        </Container>
      </Grid>
    </PublicWrapper>
  );
};

export default NotFound;
