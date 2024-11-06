import React from 'react';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';

const PublicWrapper = ({ children }) => <Container maxWidth="xl">{children}</Container>;
PublicWrapper.propTypes = {
  children: PropTypes.element.isRequired,
};

export default PublicWrapper;
