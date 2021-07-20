import React, { useRef, RefObject, useEffect, useState } from 'react';
import { Box, makeStyles, Hidden, IconButton } from '@material-ui/core';
import { useInterval, useBoolean } from 'react-use';
import Countdown, { CountdownRendererFn, CountdownRenderProps } from 'react-countdown';
import { Pause, PlayCircleOutline } from '@material-ui/icons';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { toggle, shuffle } from '../../../store/features/player';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
}));
const Completionist = () => <span>You are good to go!</span>;

const Pomodoro = () => {
  const classes = useStyles();
  const [isPlaying, setIsPlaying] = useState(false);
  const { activeSounds } = useAppSelector(state => state.player);
  const ref = useRef<Countdown>(null);
  const dispatch = useAppDispatch();

  console.log(ref);
  //   useEffect(() => {

  //   // ref.current?.current
  // },[])

  const renderer = ({ hours, minutes, seconds, completed, formatted }: CountdownRenderProps) => {
    if (completed) {
      return <Completionist />;
    } else {
      return (
        <Box mx={2}>
          {formatted.minutes}:{formatted.seconds}
        </Box>
      );
    }
  };

  return (
    <Hidden smDown>
      <Box position="relative" display="flex" justifyContent="center">
        <Box className={classes.root}>
          {isPlaying && (
            <IconButton
              color="default"
              size="small"
              onClick={() => {
                dispatch(toggle(false));
                ref.current?.pause();
                setIsPlaying(!isPlaying);
              }}
            >
              <Pause />
            </IconButton>
          )}
          {!isPlaying && (
            <IconButton
              color="default"
              size="small"
              onClick={() => {
                if (activeSounds.length === 0) {
                  dispatch(shuffle());
                }

                dispatch(toggle(true));
                ref.current?.start();
                setIsPlaying(!isPlaying);
              }}
            >
              <PlayCircleOutline />
            </IconButton>
          )}
          <Countdown
            autoStart={false}
            ref={ref}
            onComplete={() => {
              console.log('completed');
              setIsPlaying(false);
              dispatch(toggle(false));
            }}
            date={Date.now() + 25 * 60 * 1000}
            renderer={renderer}
          />
        </Box>
      </Box>
    </Hidden>
  );
};

export default Pomodoro;
