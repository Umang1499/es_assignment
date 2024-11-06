import React from 'react';
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const Status = ({ value }) => (
  <Box
    sx={{
      color: value ? '#00cc00' : '#e60000',
      background: value ? '#ccffcc' : '#ffd7cc',
      width: 100,
      borderRadius: 4,
      paddingY: '1px',
      textAlign: 'center',
    }}
  >
    <Typography>{value ? 'Completed' : 'Pending'}</Typography>
  </Box>
);

Status.propTypes = {
  value: PropTypes.number.isRequired,
};

export default Status;
