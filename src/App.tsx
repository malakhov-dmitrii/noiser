import {
  AppBar,
  Box,
  Container,
  createMuiTheme,
  createStyles,
  makeStyles,
  Paper,
  Theme,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@material-ui/core';
import React from 'react';
import './App.css';
import Home from './pages/Home';
import useTheme from './shared/hooks/useTheme';

const baseTheme = createMuiTheme();
const defaultTheme = createMuiTheme({
  palette: {
    type: 'light',
    tonalOffset: 0.5,
  },
  typography: {
    h1: {
      fontSize: baseTheme.typography.pxToRem(36),
    },
    h2: {
      fontSize: baseTheme.typography.pxToRem(32),
    },
  },
});
const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    tonalOffset: 0.5,
  },
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

function App() {
  const classes = useStyles();
  const { theme } = useTheme();

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : defaultTheme}>
      <Box minHeight="100vh" component={Paper}>
        <AppBar position="static">
          <Toolbar>
            {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <Menu />
            </IconButton> */}
            <Typography variant="h6" className={classes.title}>
              Noiser
            </Typography>

            {/* <IconButton edge="end" onClick={() => toggle()}>
              <Brightness6 />
            </IconButton> */}
          </Toolbar>
        </AppBar>

        <Container maxWidth="md">
          <Box pt={5}>
            <Home />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
