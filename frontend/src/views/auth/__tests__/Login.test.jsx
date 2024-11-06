/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import Login from '../Login';
import { login } from '../../../services/Auth';
import useToastr from '../../../hooks/useToastr';
import RoutePaths from '../../../configs/Routes';

jest.mock('../../../services/Auth');
jest.mock('../../../hooks/useToastr');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: jest.fn(),
  }),
}));

describe('Login Component', () => {
  const mockLogin = login;
  const mockUseToastr = useToastr;
  const realLocation = window.location;

  beforeAll(() => {
    delete window.location;
    window.location = { assign: jest.fn() };
  });

  afterAll(() => {
    window.location = realLocation;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseToastr.mockReturnValue({
      showSuccessToastr: jest.fn(),
      showErrorToastr: jest.fn(),
    });
  });

  it('renders login form without fai;l', () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    mockLogin.mockResolvedValue({ success: true });

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByTestId('login-form-email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('login-form-password'), {
      target: { value: 'password123' },
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('login-form-submit-btn'));
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockUseToastr().showSuccessToastr).toHaveBeenCalledWith('Logged in successfully.');
      expect(window.localStorage.getItem('isLoggedIn')).toBe('true');
      expect(window.location.assign).toHaveBeenCalledWith(RoutePaths.HOME);
    });
  });

  it('shows error message on login failure', async () => {
    const errorMessage = 'Invalid credentials';
    mockLogin.mockRejectedValue({ response: { data: { message: errorMessage } } });

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByTestId('login-form-email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('login-form-password'), {
      target: { value: 'wrongpassword' },
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('login-form-submit-btn'));
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'wrongpassword',
      });
      expect(mockUseToastr().showErrorToastr).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('disables submit button while processing', async () => {
    mockLogin.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000))
    );

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByTestId('login-form-email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('login-form-password'), {
      target: { value: 'password123' },
    });

    const submitButton = screen.getByTestId('login-form-submit-btn');

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Logging in')).toBeInTheDocument();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });
  });

  it('redirects to home if already logged in', () => {
    const replaceMock = jest.fn();
    window.localStorage.setItem('isLoggedIn', 'true');
    // eslint-disable-next-line global-require
    jest.spyOn(require('react-router-dom'), 'useHistory').mockReturnValue({ replace: replaceMock });

    render(
      <Router>
        <Login />
      </Router>
    );

    expect(replaceMock).toHaveBeenCalledWith(RoutePaths.HOME);
  });
});
