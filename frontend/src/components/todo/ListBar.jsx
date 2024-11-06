import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Skeleton from '@mui/material/Skeleton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { ListItemButton, ListItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/MenuOpen';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { Edit } from '@mui/icons-material';
import { NAV_DRAWER_WIDTH } from '../../configs/Constants';
import RoutePaths from '../../configs/Routes';
import useTodo from '../../hooks/useTodo';
import TodoListForm from './TodoListForm';

const SideBar = ({ open, onClose }) => {
  const params = useParams();
  const listId = params.id;
  const history = useHistory();
  const { userTodoList, listLoading, removeList, selectedTodoList } = useTodo();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [todoListFormDialog, setTodoListFormDialog] = useState(false);
  const [actionTodoData, setActionTodoData] = useState(null);

  const handleListItemClick = (event, index, list) => {
    history.push(RoutePaths.LIST_VIEW.replace(':id', list._id));
    setSelectedIndex(index);
  };

  const handleEditList = (list) => {
    setActionTodoData(list);
    setTodoListFormDialog(true);
  };

  const handleAddList = () => {
    setActionTodoData(null);
    setTodoListFormDialog(true);
  };

  const handleDeleteList = (list) => {
    removeList(list._id).then(() => {
      if (selectedTodoList === list._id) {
        history.replace(RoutePaths.HOME);
        setSelectedIndex(0);
      }
    });
  };

  const onCloseForm = () => {
    setActionTodoData(null);
    setTodoListFormDialog(false);
  };

  useEffect(() => {
    if (userTodoList.length > 0 && !listId) {
      history.replace(RoutePaths.LIST_VIEW.replace(':id', userTodoList[0]._id));
      setSelectedIndex(0);
    } else if (userTodoList.length > 0 && listId) {
      setSelectedIndex(userTodoList.findIndex((x) => x._id === listId));
    }
  }, [userTodoList, listId]);

  return (
    <>
      <Drawer
        open={open}
        variant="persistent"
        anchor="left"
        onClose={onClose}
        sx={{
          width: NAV_DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            minWidth: NAV_DRAWER_WIDTH,
            bgcolor: 'background.paper',
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            height: 80,
            flexShrink: 0,
            px: 0.5,
            position: 'sticky',
            top: 0,
            zIndex: 'appBar',
            backgroundColor: 'inherit',
            backgroundImage: 'inherit',
          }}
        >
          <IconButton aria-label="Close navigation drawer" onClick={onClose} size="large">
            <CloseIcon />
          </IconButton>
        </Stack>

        <nav>
          {listLoading ? (
            <List>
              {[...Array(3)].map(() => (
                <li>
                  <ListItemButton>
                    <Skeleton variant="text" width="100%" height={40} />
                  </ListItemButton>
                </li>
              ))}
            </List>
          ) : (
            <List sx={{ cursor: 'pointer' }}>
              {userTodoList.map((list, index) => (
                <ListItem
                  sx={{ cursor: 'pointer' }}
                  selected={selectedIndex === index}
                  onClick={(event) => handleListItemClick(event, index, list)}
                  secondaryAction={
                    <>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditList(list);
                        }}
                        edge="end"
                        aria-label="edit"
                        sx={{ mr: '2px' }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteList(list);
                        }}
                        edge="end"
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemIcon>
                    <ListAltIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={list.name}
                    primaryTypographyProps={{
                      style: {
                        maxWidth: 120,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      },
                    }}
                  />
                </ListItem>
              ))}
              <Divider variant="middle" sx={{ my: 1 }} />
              <ListItemButton onClick={() => handleAddList()}>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="New List" />
              </ListItemButton>
            </List>
          )}
        </nav>
      </Drawer>
      {todoListFormDialog && (
        <TodoListForm
          editId={actionTodoData?._id || null}
          name={actionTodoData?.name || 'New List'}
          onSave={onCloseForm}
          onClose={onCloseForm}
        />
      )}
    </>
  );
};
SideBar.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SideBar;
