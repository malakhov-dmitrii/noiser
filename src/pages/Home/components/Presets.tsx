import React from 'react';
import { Box, Grid, Typography, makeStyles } from '@material-ui/core';
import { playPlaylistFromGroup } from '../../../store/features/player';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';

const useStyles = makeStyles(() => ({
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

const Presets = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const { presets } = useAppSelector(state => state.player);

  return (
    <Box my={3}>
      <Grid container spacing={2}>
        {presets.map(preset => (
          <Grid item key={preset.title}>
            <Box
              onClick={() => {
                dispatch(playPlaylistFromGroup(preset.title));
                // @ts-ignore
                ym(73469224, 'reachGoal', 'start-playlist');
              }}
              className={classes.playlistItem}
            >
              <Typography variant="caption">{preset.title}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Presets;
