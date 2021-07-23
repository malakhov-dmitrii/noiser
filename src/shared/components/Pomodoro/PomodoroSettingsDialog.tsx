import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, Button, Box } from '@material-ui/core';
import { useAppSelector } from '../../../store/hooks';
import { useFirebase } from 'react-redux-firebase';
import { Timer } from '@material-ui/icons';
import { db } from '../../..';
import { defaultSettings } from '../../config';

const PomodoroSettingsDialog = ({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: () => void }) => {
  const firebase = useFirebase();
  const { auth, profile } = useAppSelector(s => s.firebase);

  const notAuth = (
    <DialogContent>
      <DialogContentText>
        To adjust these settings, you need to login
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={() => firebase.login({ provider: 'google', type: 'popup' })}>
            Login with Google
          </Button>
        </Box>
      </DialogContentText>
    </DialogContent>
  );

  const content = (
    <>
      <DialogContent>
        {/* <DialogContentText>
          To subscribe to this website, please enter your email address here. We will send updates occasionally.
        </DialogContentText> */}
        <Box width={250}>
          <TextField
            variant="outlined"
            autoFocus
            fullWidth
            margin="dense"
            label="Pomodoro duration (in minutes)"
            type="number"
            inputProps={{ min: 1 }}
            value={profile.settings?.pomodoroDuration || defaultSettings.pomodoroDuration}
            onChange={e => {
              const v = +e.target.value;
              if (v > 0) {
                db.ref(`/users/${auth.uid}/settings/pomodoroDuration`).set(v);
              }
            }}
          />
        </Box>
        <Box my={1}>
          <Button
            startIcon={<Timer />}
            variant="text"
            color="secondary"
            href="https://pomofocus.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Advanced Pomodoro timer
          </Button>
        </Box>
      </DialogContent>

      {/* <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onSave} color="primary">
          Save
        </Button>
      </DialogActions> */}
    </>
  );

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" fullWidth maxWidth="sm">
      <DialogTitle id="form-dialog-title">Noizer Pomodoro Settings</DialogTitle>
      {!auth.isEmpty && auth.isLoaded ? content : notAuth}
    </Dialog>
  );
};

export default PomodoroSettingsDialog;
