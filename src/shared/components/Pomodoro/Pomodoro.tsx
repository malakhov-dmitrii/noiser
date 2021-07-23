import React, { useRef, useState, useMemo } from 'react';
import { Box, makeStyles, Hidden, IconButton, Tooltip } from '@material-ui/core';
import Countdown, { CountdownRenderProps } from 'react-countdown';
import { Pause, PlayCircleOutline, Settings } from '@material-ui/icons';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { toggle, shuffle } from '../../../store/features/player';
import PomodoroSettingsDialog from './PomodoroSettingsDialog';
import { defaultSettings } from '../../config';

const useStyles = makeStyles(theme => ({
  root: {
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
  },
}));
const Completionist = () => <span>You are good to go!</span>;

const Pomodoro = () => {
  const classes = useStyles();
  const [isPlaying, setIsPlaying] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { activeSounds } = useAppSelector(state => state.player);
  const { profile } = useAppSelector(state => state.firebase);
  const ref = useRef<Countdown>(null);
  const dispatch = useAppDispatch();

  const renderer = ({ completed, formatted }: CountdownRenderProps) => {
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

  const duration = profile.settings?.pomodoroDuration || defaultSettings.pomodoroDuration;

  const timerDuration = useMemo(() => Date.now() + duration * 60 * 1000, [duration]);

  return (
    <Hidden smDown>
      <Box position="relative" display="flex" justifyContent="center" mx={4}>
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
              setIsPlaying(false);
              dispatch(toggle(false));
            }}
            date={timerDuration}
            renderer={renderer}
          />

          <Tooltip title="Coming soon">
            <IconButton
              color="default"
              size="small"
              onClick={() => {
                setSettingsOpen(true);
              }}
            >
              <Settings />
            </IconButton>
          </Tooltip>
          <PomodoroSettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} onSave={() => setSettingsOpen(false)} />
        </Box>
      </Box>
    </Hidden>
  );
};

export default Pomodoro;
