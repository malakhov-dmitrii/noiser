import React from 'react';
import { Box, Grid, Typography, makeStyles } from '@material-ui/core';
import { playPlaylistFromGroup } from '../../../store/features/player';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';

const useStyles = makeStyles(theme => ({
  root: {
    overflowX: 'scroll',
    paddingBottom: theme.spacing(1),
  },
  rootTitle: {
    whiteSpace: 'nowrap',
    maxWidth: 120,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  playlistItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #c8c8c8',
    borderRadius: 10,
    height: 50,
    transition: 'all 0.15s',
    cursor: 'pointer',
    margin: theme.spacing(0, 1),
    padding: theme.spacing(0, 2),
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
    <Box my={3} display="flex" mx={-1} className={classes.root}>
      {presets.map(preset => (
        <Box
          key={preset.title}
          onClick={() => {
            dispatch(playPlaylistFromGroup(preset.title));
            // @ts-ignore
            ym(73469224, 'reachGoal', 'start-playlist');
          }}
          className={classes.playlistItem}
        >
          <Typography variant="body1" className={classes.rootTitle}>
            {preset.title}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Presets;
