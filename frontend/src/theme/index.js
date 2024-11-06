import { createTheme } from '@mui/material';

const themeOptions = {
  palette: {
    type: 'light',
    primary: {
      main: 'rgb(68, 0, 255)',
    },
    secondary: {
      main: 'rgb(32, 26, 40)',
    },
    error: {
      main: 'rgb(176, 0, 32)',
    },
    success: {
      main: '#34c759',
    },
  },
};

const appTheme = createTheme({ ...themeOptions, typography: { fontFamily: 'Public Sans' } });

export default appTheme;
