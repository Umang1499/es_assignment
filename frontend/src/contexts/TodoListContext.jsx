import React, { useState, useCallback, useEffect } from 'react';
import Proptypes from 'prop-types';
import {
  getLists,
  createList,
  updateList,
  deleteList,
  getListItems,
  createListItem,
  updateListItem,
  deleteListItem,
} from '../services/Todo';
import useToastr from '../hooks/useToastr';

export const TodoListContext = React.createContext({
  userTodoList: [],
  currentTodoListItems: [],
  listLoading: true,
  listItemLoading: true,
  selectedTodoList: null,
  selectedTodoListItem: null,
  setSelectedTodoList: () => {},
  setSelectedTodoListItem: () => {},
  addList: async () => {},
  editList: async () => {},
  removeList: async () => {},
  addItem: async () => {},
  editItem: async () => {},
  removeItem: async () => {},
});

export const TodoListProvider = ({ children }) => {
  const { showSuccessToastr, showErrorToastr } = useToastr();
  const [userTodoList, setUserTodoList] = useState([]);
  const [selectedTodoList, setSelectedTodoList] = useState(null);
  const [currentTodoListItems, setCurrentTodoListItems] = useState([]);
  const [selectedTodoListItem, setSelectedTodoListItem] = useState(null);

  const [listLoading, setListLoading] = useState(true);
  const [listItemLoading, setListItemLoading] = useState(true);

  const fetchLists = useCallback(async () => {
    if (localStorage.getItem('isLoggedIn')) {
      try {
        setListLoading(true);
        const result = await getLists();
        setUserTodoList(result.data);
      } catch (err) {
        showErrorToastr('Failed to fetch lists');
      } finally {
        setListLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const addList = async (name) => {
    try {
      const { data } = await createList(name);
      await fetchLists();
      showSuccessToastr('List created successfully.');
      return data;
    } catch (err) {
      showErrorToastr('Failed to create list');
      return null;
    }
  };

  const editList = async (id, name) => {
    try {
      await updateList(id, name);
      await fetchLists();
      showSuccessToastr('List updated successfully.');
    } catch (err) {
      showErrorToastr('Failed to create list');
    }
  };

  const removeList = async (id) => {
    try {
      await deleteList(id);
      await fetchLists();
      if (id === selectedTodoList)
        setSelectedTodoList(
          userTodoList.length > 0 && userTodoList[0]._id !== id ? userTodoList[0]._id : null
        );
      showSuccessToastr('List deleted successfully.');
    } catch (err) {
      showErrorToastr('Failed to delete list');
    }
  };

  const fetchItems = useCallback(async () => {
    if (!selectedTodoList) {
      setCurrentTodoListItems([]);
      return;
    }
    try {
      setListItemLoading(true);
      const result = await getListItems(selectedTodoList);
      setCurrentTodoListItems(result.data);
    } catch (err) {
      showErrorToastr('Failed to fetch list items');
    } finally {
      setListItemLoading(false);
    }
  }, [selectedTodoList]);

  useEffect(() => {
    if (selectedTodoList) fetchItems();
  }, [fetchItems, selectedTodoList]);

  const addItem = async ({ title, detail }) => {
    if (!selectedTodoList) return;
    try {
      await createListItem(selectedTodoList, { title, detail });
      await fetchItems();
      showSuccessToastr('List item created successfully.');
    } catch (err) {
      showErrorToastr('Failed to create list item');
    }
  };

  const editItem = async (itemId, { title, detail, completed }) => {
    if (!selectedTodoList) return;

    try {
      await updateListItem(itemId, { listId: selectedTodoList, title, detail, completed });
      await fetchItems();
      showSuccessToastr('List item updated successfully.');
    } catch (err) {
      showErrorToastr('Failed to update list item');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await deleteListItem(itemId, selectedTodoList);
      await fetchItems();
      showSuccessToastr('List item deleted successfully.');
    } catch (err) {
      showErrorToastr('Failed to delete list item');
    }
  };

  return (
    <>
      <TodoListContext.Provider
        value={{
          userTodoList,
          currentTodoListItems,
          listLoading,
          listItemLoading,
          selectedTodoList,
          setSelectedTodoList,
          selectedTodoListItem,
          setSelectedTodoListItem,
          addList,
          editList,
          removeList,
          addItem,
          editItem,
          removeItem,
        }}
      >
        {children}
      </TodoListContext.Provider>
    </>
  );
};

TodoListProvider.propTypes = {
  children: Proptypes.node.isRequired,
};
