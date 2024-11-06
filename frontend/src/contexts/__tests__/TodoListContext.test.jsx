/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TodoListProvider, TodoListContext } from '../TodoListContext';
import * as TodoService from '../../services/Todo';
import useToastr from '../../hooks/useToastr';

jest.mock('../../services/Todo');
jest.mock('../../hooks/useToastr');

const mockUseToastr = useToastr;

describe('TodoListProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useToastr.mockReturnValue({
      showSuccessToastr: jest.fn(),
      showErrorToastr: jest.fn(),
    });
    localStorage.setItem('isLoggedIn', 'true');
  });

  it('fetches lists on mount', async () => {
    const mockLists = [{ _id: '1', name: 'Test List' }];
    TodoService.getLists.mockResolvedValue({ data: mockLists });

    let contextValue;
    const TestComponent = () => {
      contextValue = React.useContext(TodoListContext);
      return null;
    };

    await act(async () => {
      render(
        <TodoListProvider>
          <TestComponent />
        </TodoListProvider>
      );
    });

    expect(TodoService.getLists).toHaveBeenCalled();
    expect(contextValue.userTodoList).toEqual(mockLists);
  });

  it('adds a new list', async () => {
    const mockNewList = { _id: '2', name: 'New List' };
    TodoService.createList.mockResolvedValue({ data: mockNewList });
    TodoService.getLists.mockResolvedValue({ data: [mockNewList] });

    let contextValue;
    const TestComponent = () => {
      contextValue = React.useContext(TodoListContext);
      return null;
    };

    await act(async () => {
      render(
        <TodoListProvider>
          <TestComponent />
        </TodoListProvider>
      );
    });

    await act(async () => {
      await contextValue.addList('New List');
    });

    expect(TodoService.createList).toHaveBeenCalledWith('New List');
    expect(TodoService.getLists).toHaveBeenCalled();
    expect(mockUseToastr().showSuccessToastr).toHaveBeenCalledWith('List created successfully.');
    expect(contextValue.userTodoList).toContainEqual(mockNewList);
  });

  it('edits an existing list', async () => {
    const mockList = { _id: '1', name: 'Old Name' };
    const updatedList = { _id: '1', name: 'Updated Name' };
    TodoService.getLists.mockResolvedValue({ data: [mockList] });
    TodoService.updateList.mockResolvedValue({ data: updatedList });
    TodoService.getLists.mockResolvedValue({ data: [updatedList] });

    let contextValue;
    const TestComponent = () => {
      contextValue = React.useContext(TodoListContext);
      return null;
    };

    await act(async () => {
      render(
        <TodoListProvider>
          <TestComponent />
        </TodoListProvider>
      );
    });

    await act(async () => {
      await contextValue.editList('1', 'Updated Name');
    });

    expect(TodoService.updateList).toHaveBeenCalledWith('1', 'Updated Name');
    expect(TodoService.getLists).toHaveBeenCalled();
    expect(mockUseToastr().showSuccessToastr).toHaveBeenCalledWith('List updated successfully.');
    expect(contextValue.userTodoList[0].name).toBe('Updated Name');
  });

  it('removes a list', async () => {
    const mockLists = [
      { _id: '1', name: 'List to Remove' },
      { _id: '2', name: 'Remaining List' },
    ];
    TodoService.getLists.mockResolvedValue({ data: mockLists });
    TodoService.deleteList.mockResolvedValue({});
    TodoService.getLists.mockResolvedValue({ data: [{ _id: '2', name: 'Remaining List' }] });

    let contextValue;
    const TestComponent = () => {
      contextValue = React.useContext(TodoListContext);
      return null;
    };

    await act(async () => {
      render(
        <TodoListProvider>
          <TestComponent />
        </TodoListProvider>
      );
    });

    await act(async () => {
      await contextValue.removeList('1');
    });

    expect(TodoService.deleteList).toHaveBeenCalledWith('1');

    // Wait for fetchLists to complete and verify updated list
    await waitFor(() => {
      expect(TodoService.getLists).toHaveBeenCalledTimes(2); // Once on load, once after deletion
      expect(mockUseToastr().showSuccessToastr).toHaveBeenCalledWith('List deleted successfully.');
      expect(contextValue.userTodoList).toHaveLength(1);
      expect(contextValue.userTodoList[0].name).toBe('Remaining List');
    });
  });

  it('fetches list items when a list is selected', async () => {
    const mockItems = [{ _id: '1', title: 'Test Item', detail: 'Test Detail' }];
    TodoService.getListItems.mockResolvedValue({ data: mockItems });

    let contextValue;
    const TestComponent = () => {
      contextValue = React.useContext(TodoListContext);
      return null;
    };

    await act(async () => {
      render(
        <TodoListProvider>
          <TestComponent />
        </TodoListProvider>
      );
    });

    await act(async () => {
      contextValue.setSelectedTodoList('1');
    });

    await waitFor(() => {
      expect(TodoService.getListItems).toHaveBeenCalledWith('1');
      expect(contextValue.currentTodoListItems).toEqual(mockItems);
    });
  });

  it('adds a new list item', async () => {
    const mockNewItem = { _id: '1', title: 'New Item', detail: 'New Detail' };
    TodoService.createListItem.mockResolvedValue({ data: mockNewItem });
    TodoService.getListItems.mockResolvedValue({ data: [mockNewItem] });

    let contextValue;
    const TestComponent = () => {
      contextValue = React.useContext(TodoListContext);
      return null;
    };

    await act(async () => {
      render(
        <TodoListProvider>
          <TestComponent />
        </TodoListProvider>
      );
    });

    await act(async () => {
      contextValue.setSelectedTodoList('1');
    });

    await waitFor(() => {
      expect(contextValue.selectedTodoList).toBe('1');
    });

    await act(async () => {
      await contextValue.addItem({ title: 'New Item', detail: 'New Detail' });
    });

    expect(TodoService.createListItem).toHaveBeenCalledWith('1', {
      title: 'New Item',
      detail: 'New Detail',
    });
    expect(TodoService.getListItems).toHaveBeenCalledWith('1');
    expect(mockUseToastr().showSuccessToastr).toHaveBeenCalledWith(
      'List item created successfully.'
    );
    expect(contextValue.currentTodoListItems).toContainEqual(mockNewItem);
  });

  it('edits an existing list item', async () => {
    const mockItem = { _id: '1', title: 'Old Title', detail: 'Old Detail' };
    const updatedItem = { _id: '1', title: 'Updated Title', detail: 'Updated Detail' };
    TodoService.getListItems.mockResolvedValue({ data: [mockItem] });
    TodoService.updateListItem.mockResolvedValue({ data: updatedItem });
    TodoService.getListItems.mockResolvedValue({ data: [updatedItem] });

    let contextValue;
    const TestComponent = () => {
      contextValue = React.useContext(TodoListContext);
      return null;
    };

    await act(async () => {
      render(
        <TodoListProvider>
          <TestComponent />
        </TodoListProvider>
      );
    });

    await act(async () => {
      contextValue.setSelectedTodoList('1');
    });

    await waitFor(() => {
      expect(contextValue.selectedTodoList).toBe('1');
    });

    await act(async () => {
      await contextValue.editItem('1', { title: 'Updated Title', detail: 'Updated Detail' });
    });

    expect(TodoService.updateListItem).toHaveBeenCalledWith('1', {
      listId: '1',
      title: 'Updated Title',
      detail: 'Updated Detail',
    });
    expect(TodoService.getListItems).toHaveBeenCalledWith('1');
    expect(mockUseToastr().showSuccessToastr).toHaveBeenCalledWith(
      'List item updated successfully.'
    );
    expect(contextValue.currentTodoListItems[0]).toEqual(updatedItem);
  });

  it('removes a list item', async () => {
    const mockItems = [
      { _id: '1', title: 'Item to Remove' },
      { _id: '2', title: 'Remaining Item' },
    ];
    const updatedMockItems = [{ _id: '2', title: 'Remaining Item' }];
    TodoService.getListItems
      .mockResolvedValueOnce({ data: mockItems })
      .mockResolvedValueOnce({ data: updatedMockItems });
    TodoService.deleteListItem.mockResolvedValue({});

    let contextValue;
    const TestComponent = () => {
      contextValue = React.useContext(TodoListContext);
      return null;
    };

    await act(async () => {
      render(
        <TodoListProvider>
          <TestComponent />
        </TodoListProvider>
      );
    });

    await act(async () => {
      contextValue.setSelectedTodoList('1');
    });

    await waitFor(() => {
      expect(contextValue.selectedTodoList).toBe('1');
    });

    await act(async () => {
      await contextValue.removeItem('1');
    });

    expect(TodoService.deleteListItem).toHaveBeenCalledWith('1', '1');
    expect(TodoService.getListItems).toHaveBeenCalledWith('1');
    expect(mockUseToastr().showSuccessToastr).toHaveBeenCalledWith(
      'List item deleted successfully.'
    );
    expect(contextValue.currentTodoListItems).toHaveLength(1);
    expect(contextValue.currentTodoListItems[0].title).toBe('Remaining Item');
  });

  it('handles errors when fetching lists', async () => {
    TodoService.getLists.mockRejectedValue(new Error('Failed to fetch lists'));

    let contextValue;
    const TestComponent = () => {
      contextValue = React.useContext(TodoListContext);
      return null;
    };

    await act(async () => {
      render(
        <TodoListProvider>
          <TestComponent />
        </TodoListProvider>
      );
    });

    expect(mockUseToastr().showErrorToastr).toHaveBeenCalledWith('Failed to fetch lists');
    expect(contextValue.listLoading).toBe(false);
  });

  it('handles errors when fetching list items', async () => {
    const mockList = { _id: '1', name: 'Test List' };
    TodoService.getLists.mockResolvedValue({ data: [mockList] });
    TodoService.getListItems.mockRejectedValue(new Error('Failed to fetch list items'));

    let contextValue;
    const TestComponent = () => {
      contextValue = React.useContext(TodoListContext);
      return null;
    };

    await act(async () => {
      render(
        <TodoListProvider>
          <TestComponent />
        </TodoListProvider>
      );
    });

    await act(async () => {
      contextValue.setSelectedTodoList('1');
    });

    expect(mockUseToastr().showErrorToastr).toHaveBeenCalledWith('Failed to fetch list items');
    expect(contextValue.listItemLoading).toBe(false);
  });
});
