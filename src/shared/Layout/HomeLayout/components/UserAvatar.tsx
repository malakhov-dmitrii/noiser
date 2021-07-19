import React from 'react';
import { connect } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import { IconButton, Box, Menu, MenuItem, makeStyles, Avatar, Tooltip } from '@material-ui/core';
import { Person } from '@material-ui/icons';
import { useAppSelector } from '../../../../store/hooks';
import literalize from '../../../literalize';
import { RootState } from '../../../../store';

const useStyles = makeStyles(() => ({
  avatar: {
    cursor: 'pointer',
  },
}));

const UserAvatar = () => {
  const classes = useStyles();
  const { profile, auth } = useAppSelector(state => state.firebase);
  const firebase = useFirebase();
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = React.useState<null | HTMLElement>(null);

  function loginWithGoogle() {
    return firebase.login({ provider: 'google', type: 'popup' });
  }

  console.log(profile);

  return (
    <Box>
      {auth.isEmpty && (
        <Tooltip title="Sign In with Google">
          <IconButton onClick={() => loginWithGoogle()}>
            <Person />
          </IconButton>
        </Tooltip>
      )}
      {!auth.isEmpty && (
        <Box>
          <Avatar
            className={classes.avatar}
            alt={profile.displayName}
            src={profile.avatarUrl}
            onClick={event => setProfileMenuAnchorEl(event.currentTarget)}
          >
            {literalize(profile?.displayName)}
          </Avatar>

          <Menu
            id="simple-menu"
            anchorEl={profileMenuAnchorEl}
            keepMounted
            open={Boolean(profileMenuAnchorEl)}
            onClose={() => setProfileMenuAnchorEl(null)}
          >
            <MenuItem
              onClick={() => {
                firebase.logout();
                setProfileMenuAnchorEl(null);
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      )}
    </Box>
  );
};

const enhance = connect(({ firebase }: RootState) => {
  return {
    auth: firebase.auth,
    profile: firebase.profile,
  };
});

export default enhance(UserAvatar);
