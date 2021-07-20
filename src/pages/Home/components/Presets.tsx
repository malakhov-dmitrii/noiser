import React, { useEffect, useState } from 'react';
import { Box, Typography, makeStyles, CircularProgress } from '@material-ui/core';
import { playPlaylistFromGroup, populateUserPresets } from '../../../store/features/player';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { values, toArray } from 'lodash';
import { db } from '../../..';

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
  const { profile, auth } = useAppSelector(state => state.firebase);

  const [presetsloading, setPresetsloading] = useState(false);

  useEffect(() => {
    if (!auth.isEmpty && profile.email) {
      setPresetsloading(true);
      const getUserPresets = async () => {
        const data = (await (await db.ref(`/users/${auth.uid}/presets`).get()).toJSON()) as {
          [x: string]: {
            title: string;
            sounds: {
              title: string;
              volume: number;
            }[];
          };
        };
        const items = values(data).map(i => ({ ...i, sounds: toArray(i.sounds) }));
        setPresetsloading(false);
        dispatch(populateUserPresets({ items }));
      };
      getUserPresets();
    }
  }, [auth, dispatch, profile]);

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
      {presetsloading && <CircularProgress />}
    </Box>
  );
};

export default Presets;
