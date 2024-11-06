/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import useTodo from '../../../hooks/useTodo';
import TodoListForm from '../TodoListForm';
import { TodoListProvider } from '../../../contexts/TodoListContext';
import useToastr from '../../../hooks/useToastr';

jest.mock('../../../hooks/useTodo', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../../hooks/useToastr');

describe('TodoListForm Component', () => {
  const mockUseToastr = useToastr;

  const mockAddList = jest.fn();
  const mockEditList = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useTodo.mockReturnValue({
      addList: mockAddList,
      editList: mockEditList,
    });
    mockUseToastr.mockReturnValue({
      showSuccessToastr: jest.fn(),
      showErrorToastr: jest.fn(),
    });
  });

  it('Render without fail', () => {
    render(
      <MemoryRouter>
        <TodoListProvider>
          <TodoListForm name="New List" onClose={mockOnClose} onSave={mockOnSave} editId={null} />
        </TodoListProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('New List')).toBeInTheDocument();
  });

  it('displays list name when editing', () => {
    render(
      <MemoryRouter>
        <TodoListProvider>
          <TodoListForm name="Test List" onClose={mockOnClose} onSave={mockOnSave} editId="1" />
        </TodoListProvider>
      </MemoryRouter>
    );
    expect(screen.getByDisplayValue('Test List')).toBeInTheDocument();
  });

  it('calls addList when submitting new list', async () => {
    mockAddList.mockResolvedValue({ _id: '1', name: 'New List' });

    render(
      <MemoryRouter>
        <TodoListProvider>
          <TodoListForm name="New List" onClose={mockOnClose} onSave={mockOnSave} editId={null} />
        </TodoListProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New List' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockAddList).toHaveBeenCalledWith('New List');
      expect(mockOnSave).toHaveBeenCalled();
    });
  });

  it('calls editList when submitting edited list', async () => {
    render(
      <MemoryRouter>
        <TodoListProvider>
          <TodoListForm name="Test List" onClose={mockOnClose} onSave={mockOnSave} editId="1" />
        </TodoListProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Updated List' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockEditList).toHaveBeenCalledWith('1', 'Updated List');
      expect(mockOnSave).toHaveBeenCalled();
    });
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <MemoryRouter>
        <TodoListProvider>
          <TodoListForm name="New List" onClose={mockOnClose} onSave={mockOnSave} editId={null} />
        </TodoListProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('displays error when form submission fails', async () => {
    useTodo.mockReturnValue({
      addList: jest.fn().mockRejectedValue(new Error('API Error')),
    });

    render(
      <MemoryRouter>
        <TodoListProvider>
          <TodoListForm name="New List" onClose={mockOnClose} onSave={mockOnSave} editId={null} />
        </TodoListProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New List' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockUseToastr().showErrorToastr).toHaveBeenCalledWith('API Error');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
