import React, { useEffect } from 'react';
import { Box, Slider, Tooltip, IconButton, Typography, FormControlLabel, Switch, Hidden } from '@material-ui/core';
import { setMasterVolume, toggle } from '../../../../store/features/player';
import { AttachMoneyOutlined, FormatListNumbered, VolumeUp, VolumeOff } from '@material-ui/icons';
import ThemePicker from './ThemePicker';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import UserAvatar from './UserAvatar';
import Pomodoro from '../../../components/Pomodoro';
import { ThemeType } from '../../../hooks/useTheme';
import { useHistory } from 'react-router-dom';

const Header = ({ changeTheme }: { changeTheme: (theme: ThemeType) => void }) => {
  const dispatch = useDispatch();
  const { isPlaying, masterVolume } = useSelector((state: RootState) => state.player);
  const history = useHistory();

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

  const zen = history.location.pathname.includes('/zen');

  const title = (
    <>
      <Typography variant="h5">Noizer</Typography>

      <Box ml={2}>
        <Tooltip title="Your personalized AI-powered music flow">
          <FormControlLabel
            control={
              <Switch
                checked={zen}
                color="primary"
                onChange={() => {
                  history.push(zen ? '/' : '/zen');
                }}
                name="zen"
              />
            }
            label="Zen mode"
          />
        </Tooltip>
      </Box>
    </>
  );

  const controls = (
    <>
      <Tooltip title="Donate to the project on Patreon">
        <IconButton href="https://www.patreon.com/noizer" rel="noopener noreferrer" target="_blank">
          <AttachMoneyOutlined />
        </IconButton>
      </Tooltip>

      <Tooltip title="Vote for new features">
        <IconButton href="https://productific.com/@Noizer" rel="noopener noreferrer" target="_blank">
          <FormatListNumbered />
        </IconButton>
      </Tooltip>

      <ThemePicker changeTheme={changeTheme} />

      <Box mx={1}>
        <Tooltip title="Press spacebar to toggle mute">
          <IconButton
            onClick={() => {
              dispatch(toggle());
            }}
          >
            {isPlaying ? <VolumeUp /> : <VolumeOff />}
          </IconButton>
        </Tooltip>
      </Box>
    </>
  );

  const slider = (
    <Box width={100} height={25} mr={2}>
      <Slider
        value={masterVolume}
        min={0}
        step={0.01}
        max={1}
        onChange={(e, newValue) => {
          e.preventDefault();
          e.stopPropagation();
          dispatch(setMasterVolume(newValue as number));
        }}
      />
    </Box>
  );

  return (
    <>
      <Hidden mdDown>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box ml={2} display="flex" alignItems="center">
            {title}
          </Box>
          <Pomodoro />
          <Box display="flex" justifyContent="flex-end" alignItems="center" pr={1} pt={1}>
            {slider}

            {controls}

            <UserAvatar />
          </Box>
        </Box>
      </Hidden>
      <Hidden mdUp>
        <Box width="100%" display="flex" justifyContent="space-between" alignItems="center" px={2} py={1}>
          {title}

          <UserAvatar />
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" width="100%">
          {controls}
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" width="100%">
          {slider}
        </Box>
      </Hidden>
    </>
  );
};

export default Header;
