import React from 'react';
import { Box, Paper, Container } from '@material-ui/core';
import useTheme, { ThemeType } from '../../hooks/useTheme';
import Header from './components/Header';
import Footer from './components/Footer';
import QuickActions from './components/QuickActions';

const HomeLayout = ({ changeTheme, children }: { changeTheme: (theme: ThemeType) => void; children: JSX.Element }) => {
  const { theme: prefferedTheme, toggle } = useTheme();

  const toggleTheme = (theme: ThemeType) => {
    toggle(theme);
    changeTheme(theme);
  };

  return (
    <Box
      minHeight="100vh"
      height="auto"
      component={Paper}
      display="flex"
      justifyContent="space-between"
      flexDirection="column"
      className={prefferedTheme === 'gradient' ? 'animatedBackground' : ''}
    >
      <Header changeTheme={toggleTheme} />

      <Container maxWidth="sm">
        <Box pt={1}>{children}</Box>
      </Container>

      <QuickActions />

      <Footer />
    </Box>
  );
};

export default HomeLayout;
