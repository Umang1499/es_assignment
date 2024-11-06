import React, { useState } from 'react';
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  CircularProgress,
  Button,
  Box,
} from '@mui/material';
import { Add, Check, Delete, Edit } from '@mui/icons-material';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import useTodo from '../../hooks/useTodo';
import TableLoader from '../common/TableLoader';
import Status from '../common/DataStatus';
import TodoItemForm from './TodoItemForm';
import { convertDbDateStringToDisplayDateString } from '../../utils/Datetime';

const TodoItemTable = () => {
  const { currentTodoListItems, listItemLoading, editItem, removeItem } = useTodo();
  const [inProgress, setInProgress] = useState(false);
  const [actionTodoData, setActionTodoData] = useState(null);
  const [todoListItemFormDialog, setTodoListItemFormDialog] = useState(false);

  const columns = [
    { name: 'Name', id: 'name', width: '20%' },
    { name: 'Description', id: 'detail', width: '30%' },
    { name: 'CreatedAt', id: 'dateAdded', width: '15%' },
    { name: 'Status', id: 'status', width: '10%', align: 'center' },
  ];

  const handleUpdateStatus = async (itemId, completed) => {
    setInProgress(true);
    await editItem(itemId, { completed });
    setInProgress(false);
  };

  const handleDelete = async (itemId) => {
    setInProgress(true);
    await removeItem(itemId);
    setInProgress(false);
  };

  const handleEditList = (list) => {
    setActionTodoData(list);
    setTodoListItemFormDialog(true);
  };

  const handleAddList = () => {
    setActionTodoData(null);
    setTodoListItemFormDialog(true);
  };

  const onCloseForm = () => {
    setActionTodoData(null);
    setTodoListItemFormDialog(false);
  };

  return (
    <Box
      data-testid="todo-item-table"
      display="flex"
      flexDirection="column"
      width="100%"
      justifyContent="center"
    >
      <Box my={3} display="flex" justifyContent="space-between">
        <div />
        <Button variant="contained" disableElevation startIcon={<Add />} onClick={handleAddList}>
          Add Todo
        </Button>
      </Box>
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell width={col.width} align={col.align || 'left'} key={`col-${col.id}`}>
                  {col.name}
                </TableCell>
              ))}
              <TableCell align="center" width="15%">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listItemLoading && <TableLoader cols={5} data-testid="table-loader" />}
            {!listItemLoading && currentTodoListItems.length === 0 && (
              <TableCell align="center" size="medium" colSpan={5}>
                No records found
              </TableCell>
            )}
            {!listItemLoading &&
              currentTodoListItems.map((row) => (
                <TableRow key={`todoitem-${row._id}`}>
                  <TableCell>{row.title}</TableCell>
                  <TableCell
                    style={{
                      maxWidth: 200,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {row.detail}
                  </TableCell>
                  <TableCell>{convertDbDateStringToDisplayDateString(row.dateAdded)}</TableCell>
                  <TableCell align="center">
                    <Status value={row.completed} />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      aria-label="toggle-item-status"
                      onClick={() => {
                        handleUpdateStatus(row._id, !row.completed);
                      }}
                    >
                      {inProgress ? (
                        <CircularProgress size={22} />
                      ) : (
                        <Tooltip title={row.completed ? 'Mark pending' : 'Mark completed'}>
                          {!row.completed ? (
                            <Check color="success" />
                          ) : (
                            <NewReleasesIcon color="warning" />
                          )}
                        </Tooltip>
                      )}
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        handleEditList(row);
                      }}
                      aria-label="edit-item"
                    >
                      <Tooltip title="Edit">
                        <Edit color="primary" />
                      </Tooltip>
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        handleDelete(row._id);
                      }}
                      aria-label="delete-item"
                    >
                      {inProgress ? (
                        <CircularProgress size={22} />
                      ) : (
                        <Tooltip title="Delete">
                          <Delete color="error" />
                        </Tooltip>
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {todoListItemFormDialog && (
        <TodoItemForm todoData={actionTodoData} onClose={onCloseForm} onSave={onCloseForm} />
      )}
    </Box>
  );
};

export default TodoItemTable;
