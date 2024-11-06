import React from 'react';
import { TodoListContext } from '../contexts/TodoListContext';

export default function useTodo() {
  return React.useContext(TodoListContext);
}
