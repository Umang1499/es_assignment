import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { Box, Container } from '@mui/material';
import Navbar from '../components/common/Navbar';

const PrivateWrapper = ({ pageName, children }) => {
  const history = useHistory();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    document.title = pageName;
  }, [history, pageName]);

  useEffect(() => {
    if (!localStorage.getItem('isLoggedIn')) {
      history.replace('/logout');
    }
  }, [pageName]);

  return (
    <Box data-testid="private-wrapper">
      <Navbar title={pageName} open={open} setOpen={setOpen} />
      <Container
        sx={{
          ...(open && { marginLeft: '300px', width: `calc(100% - 256px)` }),
          p: 4,
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

PrivateWrapper.propTypes = {
  pageName: PropTypes.string,
  children: PropTypes.element.isRequired,
};
PrivateWrapper.defaultProps = {
  pageName: '',
};

export default PrivateWrapper;
