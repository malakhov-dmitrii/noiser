import React from 'react';
import { Box, Slider, Tooltip, IconButton } from '@material-ui/core';
import { setMasterVolume, toggle } from '../../../../store/features/player';
import { AttachMoneyOutlined, FormatListNumbered, VolumeUp, VolumeOff } from '@material-ui/icons';
import ThemePicker from './ThemePicker';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import UserAvatar from './UserAvatar';
import Pomodoro from '../../../components/Pomodoro';
import { ThemeType } from '../../../hooks/useTheme';

const Header = ({ changeTheme }: { changeTheme: (theme: ThemeType) => void }) => {
  const dispatch = useDispatch();
  const { isPlaying, masterVolume } = useSelector((state: RootState) => state.player);

  return (
    <Box>
      <Pomodoro />
      <Box display="flex" justifyContent="flex-end" alignItems="center" pr={1} pt={1}>
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

        <IconButton
          onClick={() => {
            dispatch(toggle());
          }}
        >
          {isPlaying ? <VolumeUp /> : <VolumeOff />}
        </IconButton>

        <UserAvatar />
      </Box>
    </Box>
  );
};

export default Header;
