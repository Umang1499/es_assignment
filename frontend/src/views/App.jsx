import React, { useEffect } from 'react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Login from './auth/Login';
import { ToastrProvider } from '../contexts/ToastrContext';
import { validateLoggedInUser } from '../services/Auth';
import Logout from './auth/Logout';
import RoutePaths from '../configs/Routes';
import NotFound from './NotFound';
import appTheme from '../theme';
import TodoList from './TodoList';
import { TodoListProvider } from '../contexts/TodoListContext';

const App = () => {
  useEffect(async () => {
    try {
      const result = await validateLoggedInUser();
      if (result.success) {
        window.localStorage.setItem('isLoggedIn', true);
      }
    } catch {
      // DO SOMETHING
    }
  }, []);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={appTheme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          <ToastrProvider>
            <Router>
              <TodoListProvider>
                <Switch>
                  <Route exact path={RoutePaths.LOGIN} component={Login} />
                  <Route exact path={RoutePaths.LOGOUT} component={Logout} />
                  <Route exact path={RoutePaths.LIST_VIEW} component={TodoList} />
                  <Route exact path={RoutePaths.HOME} component={TodoList} />
                  <Route exact path="*" component={NotFound} />
                </Switch>
              </TodoListProvider>
            </Router>
          </ToastrProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
