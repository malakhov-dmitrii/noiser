import { createMuiTheme, ThemeProvider, useMediaQuery } from '@material-ui/core';
import React from 'react';
import './App.scss';

import { BrowserRouter, Route } from 'react-router-dom';
import useTheme from './shared/hooks/useTheme';
import Notifications from './shared/components/Notifications';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import HomeLayout from './shared/Layout/HomeLayout';

const baseTheme = createMuiTheme();

function App() {
  const { theme: prefferedTheme } = useTheme();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: (prefferedTheme === 'system' && prefersDarkMode) || prefferedTheme === 'dark' ? 'dark' : 'light',
        },
        typography: {
          h1: {
            fontSize: baseTheme.typography.pxToRem(42),
          },
          h2: {
            fontSize: baseTheme.typography.pxToRem(36),
          },
          h3: {
            fontSize: baseTheme.typography.pxToRem(28),
            fontWeight: 100,
          },
        },
      }),
    [prefersDarkMode, prefferedTheme]
  );

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Route path="/" exact>
          <HomeLayout />
        </Route>
        <Route path="/privacy">
          <Privacy />
        </Route>
        <Route path="/terms">
          <Terms />
        </Route>
        <Route path="/:preset" exact>
          <HomeLayout />
        </Route>
        <Notifications />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
