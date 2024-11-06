import React from 'react';
import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Skeleton from '@mui/material/Skeleton';

const TableLoader = ({ rows, cols }) => {
  const rowsArray = [...Array(rows)].map((item, index) => index);
  const colsArray = [...Array(cols)].map((item, index) => index);

  return (
    <>
      {rowsArray.map((r) => (
        <TableRow data-testid="table-loader" key={`loader-${r}`}>
          {colsArray.map((c) => (
            <TableCell key={`loader-${c}`}>
              <Skeleton variant="text" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

TableLoader.propTypes = {
  rows: PropTypes.number,
  cols: PropTypes.number,
};

TableLoader.defaultProps = {
  rows: 5,
  cols: 5,
};

export default TableLoader;
