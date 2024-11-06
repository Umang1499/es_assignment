import { deleteApiCall, getApiCall, postApiCall } from '../utils/Api';

export const createList = async (name) => {
  const result = await postApiCall('/todolist', { name });
  return result.data;
};

export const getLists = async () => {
  const result = await getApiCall('/todolist');
  return result.data;
};

export const updateList = async (id, name) => {
  const result = await postApiCall(`/todolist/${id}`, { name });
  return result.data;
};

export const deleteList = async (id) => {
  const result = await deleteApiCall(`/todolist/${id}`);
  return result.data;
};

export const createListItem = async (listId, { title, detail }) => {
  const result = await postApiCall(`/todolist/${listId}/items`, { title, detail });
  return result.data;
};

export const getListItems = async (listId) => {
  const result = await getApiCall(`/todolist/${listId}/items`);
  return result.data;
};

export const updateListItem = async (id, { listId, title, detail, completed }) => {
  const result = await postApiCall(`/todolist/${listId}/items/${id}`, { title, detail, completed });
  return result.data;
};

export const deleteListItem = async (id, listId) => {
  const result = await deleteApiCall(`/todolist/${listId}/items/${id}`);
  return result.data;
};
