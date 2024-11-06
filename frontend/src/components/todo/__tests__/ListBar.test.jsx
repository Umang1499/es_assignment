/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import useTodo from '../../../hooks/useTodo';
import ListBar from '../ListBar';
import { TodoListProvider } from '../../../contexts/TodoListContext';

jest.mock('../../../hooks/useTodo', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('ListBar Component', () => {
  const mockUseTodo = useTodo;
  const mockRemoveList = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseTodo.mockReturnValue({
      userTodoList: [
        { _id: '1', name: 'List 1' },
        { _id: '2', name: 'List 2' },
      ],
      listLoading: false,
      removeList: mockRemoveList,
      selectedTodoList: null,
    });
  });

  it('Render without fail', () => {
    render(
      <MemoryRouter>
        <TodoListProvider>
          <ListBar open onClose={() => {}} />
        </TodoListProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('List 1')).toBeInTheDocument();
    expect(screen.getByText('List 2')).toBeInTheDocument();
  });

  it('opens TodoListForm when new list btn is clicked', async () => {
    render(
      <MemoryRouter>
        <TodoListProvider>
          <ListBar open onClose={() => {}} />
        </TodoListProvider>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('New List'));
    await waitFor(() => {
      expect(screen.getByTestId('todo-list-form')).toBeInTheDocument();
    });
  });

  it('calls removeList when delete list button is clicked', async () => {
    const mck = jest.fn().mockResolvedValue();
    useTodo.mockReturnValue({
      userTodoList: [
        { _id: '1', name: 'List 1' },
        { _id: '2', name: 'List 2' },
      ],
      listLoading: false,
      removeList: mck,
      selectedTodoList: null,
    });

    render(
      <MemoryRouter>
        <TodoListProvider>
          <ListBar open onClose={() => {}} />
        </TodoListProvider>
      </MemoryRouter>
    );
    const deleteButtons = screen.getAllByLabelText('delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mck).toHaveBeenCalled();
    });
  });

  it('opens TodoListForm for editing when edit button is clicked', async () => {
    render(
      <MemoryRouter>
        <TodoListProvider>
          <ListBar open onClose={() => {}} />
        </TodoListProvider>
      </MemoryRouter>
    );
    const editButtons = screen.getAllByLabelText('edit');
    fireEvent.click(editButtons[0]);
    await waitFor(() => {
      expect(screen.getByTestId('todo-list-form')).toBeInTheDocument();
    });
  });

  it('displays loading skeleton when loading list data', () => {
    mockUseTodo.mockReturnValue({
      userTodoList: [],
      listLoading: true,
      removeList: mockRemoveList,
      selectedTodoList: null,
    });

    render(
      <MemoryRouter>
        <TodoListProvider>
          <ListBar open onClose={() => {}} />
        </TodoListProvider>
      </MemoryRouter>
    );
    expect(screen.getAllByRole('button', { name: '' })).toHaveLength(3);
  });
});
