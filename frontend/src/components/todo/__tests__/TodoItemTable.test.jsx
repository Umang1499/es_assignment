/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import useTodo from '../../../hooks/useTodo';
import TodoItemTable from '../TodoItemTable';
import { TodoListProvider } from '../../../contexts/TodoListContext';

jest.mock('../../../hooks/useTodo', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('TodoItemTable Component', () => {
  const mockEditItem = jest.fn();
  const mockRemoveItem = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useTodo.mockReturnValue({
      currentTodoListItems: [
        {
          _id: '1',
          title: 'Todo 1',
          detail: 'Detail 1',
          completed: false,
          dateAdded: '2023-05-01T00:00:00.000Z',
        },
        {
          _id: '2',
          title: 'Todo 2',
          detail: 'Detail 2',
          completed: true,
          dateAdded: '2023-05-02T00:00:00.000Z',
        },
      ],
      listItemLoading: false,
      editItem: mockEditItem,
      removeItem: mockRemoveItem,
    });
  });

  it('Render without fail', () => {
    render(
      <TodoListProvider>
        <TodoItemTable />
      </TodoListProvider>
    );
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    useTodo.mockReturnValue({
      currentTodoListItems: [],
      listItemLoading: true,
    });

    render(
      <TodoListProvider>
        <TodoItemTable />
      </TodoListProvider>
    );
    expect(screen.getAllByTestId('table-loader')[0]).toBeInTheDocument();
  });

  it('displays no records found when there are no todo items', () => {
    useTodo.mockReturnValue({
      currentTodoListItems: [],
      listItemLoading: false,
    });

    render(
      <TodoListProvider>
        <TodoItemTable />
      </TodoListProvider>
    );
    expect(screen.getByText('No records found')).toBeInTheDocument();
  });

  it('calls editItem when status is toggled', async () => {
    render(
      <TodoListProvider>
        <TodoItemTable />
      </TodoListProvider>
    );

    const statusToggleButtons = screen.getAllByLabelText('toggle-item-status');
    fireEvent.click(statusToggleButtons[0]);

    await waitFor(() => {
      expect(mockEditItem).toHaveBeenCalledWith('1', { completed: true });
    });
  });

  it('calls removeItem when delete btn is clicked', async () => {
    render(
      <TodoListProvider>
        <TodoItemTable />
      </TodoListProvider>
    );

    const deleteButtons = screen.getAllByLabelText('delete-item');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockRemoveItem).toHaveBeenCalledWith('1');
    });
  });

  it('opens TodoItemForm when edit btn is clicked', async () => {
    render(
      <TodoListProvider>
        <TodoItemTable />
      </TodoListProvider>
    );

    const editButtons = screen.getAllByLabelText('edit-item');
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('todo-item-form')).toBeInTheDocument();
    });
  });

  it('opens TodoItemForm when add todo btn is clicked', async () => {
    render(
      <TodoListProvider>
        <TodoItemTable />
      </TodoListProvider>
    );

    fireEvent.click(screen.getByText('Add Todo'));

    await waitFor(() => {
      expect(screen.getByTestId('todo-item-form')).toBeInTheDocument();
    });
  });
});
