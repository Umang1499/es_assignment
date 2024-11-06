/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import useTodo from '../../../hooks/useTodo';
import TodoItemForm from '../TodoItemForm';
import useToastr from '../../../hooks/useToastr';
import { TodoListProvider } from '../../../contexts/TodoListContext';

jest.mock('../../../hooks/useToastr');

jest.mock('../../../hooks/useTodo', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('TodoItemForm Component', () => {
  const mockUseToastr = useToastr;
  const mockAddItem = jest.fn();
  const mockEditItem = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useTodo.mockReturnValue({
      addItem: mockAddItem,
      editItem: mockEditItem,
    });
    mockUseToastr.mockReturnValue({
      showSuccessToastr: jest.fn(),
      showErrorToastr: jest.fn(),
    });
  });

  it('Render without fail', () => {
    render(
      <TodoListProvider>
        <TodoItemForm onClose={mockOnClose} onSave={mockOnSave} />
      </TodoListProvider>
    );
    expect(screen.getByText('New Todo')).toBeInTheDocument();
  });

  it('displays todo data when editing', () => {
    const todoData = { _id: '1', title: 'Test Todo', detail: 'Test Detail' };
    render(
      <TodoListProvider>
        <TodoItemForm onClose={mockOnClose} onSave={mockOnSave} todoData={todoData} />
      </TodoListProvider>
    );
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Detail')).toBeInTheDocument();
  });

  it('calls addItem when submitting new todo', async () => {
    render(
      <TodoListProvider>
        <TodoItemForm onClose={mockOnClose} onSave={mockOnSave} />
      </TodoListProvider>
    );

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Todo' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'New Detail' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockAddItem).toHaveBeenCalledWith({ title: 'New Todo', detail: 'New Detail' });
      expect(mockOnSave).toHaveBeenCalled();
    });
  });

  it('calls editItem when submitting edited todo', async () => {
    const todoData = { _id: '1', title: 'Test Todo', detail: 'Test Detail' };
    render(
      <TodoListProvider>
        <TodoItemForm onClose={mockOnClose} onSave={mockOnSave} todoData={todoData} />
      </TodoListProvider>
    );

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Todo' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Updated Detail' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockEditItem).toHaveBeenCalledWith('1', {
        title: 'Updated Todo',
        detail: 'Updated Detail',
      });
      expect(mockOnSave).toHaveBeenCalled();
    });
  });

  it('displays error when form submission fails', async () => {
    // jest.spyOn(console, 'error').mockImplementation(() => {});
    useTodo.mockReturnValue({
      addItem: jest.fn().mockRejectedValue(new Error('API Error')),
    });

    render(
      <TodoListProvider>
        <TodoItemForm onClose={mockOnClose} onSave={mockOnSave} />
      </TodoListProvider>
    );

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Todo' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'New Detail' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockUseToastr().showErrorToastr).toHaveBeenCalledWith('API Error');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
