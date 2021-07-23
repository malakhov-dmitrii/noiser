/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Slider, Typography, IconButton } from '@material-ui/core';
import React, { FC } from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import cn from 'classnames';
import { useDispatch } from 'react-redux';
import { setVolume, Sound, toggleSound } from '../../../store/features/player';
import ReactPlayer from 'react-player';
import { ThumbUp, ThumbDown } from '@material-ui/icons';
import { useAppSelector } from '../../../store/hooks';
import { emit } from '../../../store/features/notifications';
import { analytics } from '../../..';

interface Props {
  item: Sound;
}

const useStyles = makeStyles((theme: Theme) => ({
  disabled: {
    color: theme.palette.secondary.light,
  },
  item: {
    cursor: 'pointer',
    // border: '1px solid #929292',
    borderRadius: 15,
    position: 'relative',
    boxShadow: '-8px 9px 20px 0px #7979794f',
  },
  title: {
    fontSize: theme.typography.pxToRem(72),
    opacity: 0.3,
    position: 'absolute',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.pxToRem(20),
    zIndex: 1,
    marginTop: theme.spacing(1),
    textAlign: 'center',
    lineHeight: 1.2,
  },
  like: {
    position: 'absolute',
    opacity: 0.2,
    bottom: 0,
    right: 0,
    transition: 'all 0.1s',
    '&:hover': {
      opacity: 1,
    },
  },
  dislike: {
    position: 'absolute',
    opacity: 0.2,
    bottom: 0,
    left: 0,
    transition: 'all 0.1s',
    '&:hover': {
      opacity: 1,
    },
  },
}));

const EffectItem: FC<Props> = ({ item }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { activeSounds, isPlaying, masterVolume } = useAppSelector(state => state.player);
  const { auth } = useAppSelector(state => state.firebase);

  const activeItem = activeSounds.find(i => item.title === i.title)!;

  return (
    <Box
      margin="auto"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={3}
      height={100}
      className={classes.item}
      onClick={e => {
        if (!item.disabled) {
          // @ts-ignore
          ym(73469224, 'reachGoal', 'pick-sound');
          dispatch(toggleSound(item.title));
        }
      }}
    >
      <Typography className={cn({ [classes.disabled]: item.disabled }, classes.title)} variant="h3">
        {item.emoji}
      </Typography>
      <Typography className={cn({ [classes.disabled]: item.disabled }, classes.subtitle)} variant="h3">
        {item.title}
      </Typography>

      {auth.isLoaded && !auth.isEmpty && (
        <>
          <IconButton
            className={classes.like}
            size="small"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              dispatch(emit('Like saved', 'success'));
              analytics.logEvent(`Like ${item.title}`);
            }}
          >
            <ThumbUp fontSize="small"></ThumbUp>
          </IconButton>

          <IconButton
            size="small"
            className={classes.dislike}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              dispatch(emit('Dislike saved', 'success'));
              analytics.logEvent(`Dislike ${item.title}`);
            }}
          >
            <ThumbDown fontSize="small"></ThumbDown>
          </IconButton>
        </>
      )}

      <ReactPlayer
        width={0}
        playing={!!activeItem}
        muted={!isPlaying}
        volume={activeItem?.volume * masterVolume || 0}
        loop
        url={item.file}
        config={{
          file: {
            forceAudio: true,
          },
        }}
      />

      {!!activeItem && (
        <Box
          width="100%"
          height={50}
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <Slider
            value={activeItem.volume}
            min={0}
            step={0.01}
            max={1}
            onChange={(e, newValue) => {
              e.preventDefault();
              e.stopPropagation();
              dispatch(setVolume({ title: activeItem.title, amount: newValue as number }));
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default EffectItem;
