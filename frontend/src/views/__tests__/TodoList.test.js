/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route } from 'react-router-dom';
import { TodoListProvider } from '../../contexts/TodoListContext';
import TodoList from '../TodoList';
import useTodo from '../../hooks/useTodo';

jest.mock('../../hooks/useTodo', () => ({
  __esModule: true,
  default: jest.fn(),
}));

beforeEach(() => {
  Storage.prototype.getItem = jest.fn((key) => {
    if (key === 'isLoggedIn') {
      return 'true';
    }
    return null;
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

jest.mock('../../components/todo/TodoItemTable', () => ({
  __esModule: true,
  // eslint-disable-next-line react/jsx-filename-extension
  default: () => <div data-testid="todo-item-table">TodoItemTable</div>,
}));

describe('TodoList Component', () => {
  const mockUseTodo = useTodo;

  beforeEach(() => {
    mockUseTodo.mockReturnValue({
      userTodoList: [],
      listLoading: false,
      setSelectedTodoList: jest.fn(),
    });
  });

  it('Render without fail', () => {
    render(
      <MemoryRouter>
        <TodoListProvider>
          <TodoList />
        </TodoListProvider>
      </MemoryRouter>
    );
    expect(screen.getByTestId('private-wrapper')).toBeInTheDocument();
  });

  it('displays empty list message when user have no todolist', () => {
    render(
      <MemoryRouter>
        <TodoListProvider>
          <TodoList />
        </TodoListProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('No Lists')).toBeInTheDocument();
    expect(screen.getByText('Create a list to manage your todos.')).toBeInTheDocument();
  });

  it('displays TodoItemTable when there are todo lists', () => {
    mockUseTodo.mockReturnValue({
      userTodoList: [{ _id: '1', name: 'Test List' }],
      listLoading: false,
      setSelectedTodoList: jest.fn(),
    });

    render(
      <MemoryRouter>
        <TodoListProvider>
          <TodoList />
        </TodoListProvider>
      </MemoryRouter>
    );
    expect(screen.getByTestId('todo-item-table')).toBeInTheDocument();
  });

  it('sets the selected todo list when a listId is in the URL', async () => {
    const mockSetSelectedTodoList = jest.fn();
    mockUseTodo.mockReturnValue({
      userTodoList: [{ _id: '1', name: 'Test List' }],
      listLoading: false,
      setSelectedTodoList: mockSetSelectedTodoList,
    });

    render(
      <MemoryRouter initialEntries={['/list/1']}>
        <TodoListProvider>
          <Route path="/list/:id">
            <TodoList />
          </Route>
        </TodoListProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockSetSelectedTodoList).toHaveBeenCalledWith('1');
    });
  });

  it('update the page name when a list is selected', async () => {
    mockUseTodo.mockReturnValue({
      userTodoList: [{ _id: '1', name: 'Test List' }],
      listLoading: false,
      setSelectedTodoList: jest.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/list/1']}>
        <TodoListProvider>
          <Route path="/list/:id">
            <TodoList />
          </Route>
        </TodoListProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('navbar-title')).toHaveTextContent('Test List');
    });
  });
});
