import { Box, Button, Divider, Grid, Typography } from '@material-ui/core';
import { Shuffle } from '@material-ui/icons';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { playPlaylistFromGroup, shuffle, toggle } from '../../store/features/player';
import EffectItem from './components/EffectItem';

import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  playlistItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #c8c8c8',
    borderRadius: 10,
    width: 150,
    height: 50,
    transition: 'all 0.15s',
    cursor: 'pointer',
    '&:hover': {
      background: '#9c9c9c21',
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { sounds, presets } = useSelector((state: RootState) => state.player);

  const handlePlay = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      dispatch(toggle());
    }
  };

  useEffect(() => {
    window.addEventListener('keypress', handlePlay);
    return () => {
      window.removeEventListener('keypress', handlePlay);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box pt={5}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h1">Noiser</Typography>
        <Button
          onClick={() => {
            dispatch(shuffle());
          }}
          startIcon={<Shuffle />}
        >
          Shuffle
        </Button>
      </Box>
      <Divider />

      <Box my={3}>
        <Grid container spacing={2}>
          {presets.map(preset => (
            <Grid item key={preset.title}>
              <Box
                onClick={() => {
                  dispatch(playPlaylistFromGroup(preset.title));
                }}
                className={classes.playlistItem}
              >
                <Typography variant="caption">{preset.title}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Divider></Divider>

      <Box mt={2}>
        <Grid container spacing={3}>
          {sounds.map(i => (
            <Grid item xs={6} md={3} key={i.title}>
              <EffectItem item={i} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
