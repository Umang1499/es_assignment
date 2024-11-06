import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, Container, Box } from '@mui/material';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import PrivateWrapper from '../layouts/Private';
import useTodo from '../hooks/useTodo';
import TodoItemTable from '../components/todo/TodoItemTable';

const TodoList = () => {
  const params = useParams();
  const { userTodoList, listLoading, setSelectedTodoList } = useTodo();
  const [pageName, setPageName] = useState('Todo List');

  useEffect(() => {
    if (params.id) {
      setSelectedTodoList(params.id);
      if (!listLoading) {
        setPageName(
          userTodoList.length > 0 ? userTodoList.find((x) => x._id === params.id)?.name : 'TodoList'
        );
      }
    }
  }, [params, listLoading]);

  return (
    <PrivateWrapper pageName={pageName}>
      {!listLoading && userTodoList.length === 0 ? (
        <Box
          sx={{
            height: '90vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            justifyItems: 'center',
            alignContent: 'center',
          }}
          align="center"
        >
          <Container component="div">
            <Typography component="h4" variant="h3">
              No Lists
            </Typography>
            <Typography component="p">Create a list to manage your todos.</Typography>
          </Container>
        </Box>
      ) : (
        <TodoItemTable />
      )}
    </PrivateWrapper>
  );
};

TodoList.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

TodoList.defaultProps = {
  match: {
    params: {
      id: '',
    },
  },
};

export default TodoList;
