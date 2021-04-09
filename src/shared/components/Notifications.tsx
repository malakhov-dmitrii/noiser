import React, { useEffect, useState } from 'react';

import {
  Box,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  DialogContentText,
  Typography,
  Divider,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { dismiss, selectNotifications, compareChanges, setShowChangelog, setDontNotifyChangelog } from '../../store/features/notifications';
import changelog from '../changelog';

const Notifications = () => {
  const { items, showChangelog } = useSelector(selectNotifications);
  const dispatch = useDispatch();
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    dispatch(compareChanges());
  }, [dispatch]);

  const handleClose = (id: number) => {
    dispatch(dismiss(id));
  };

  return (
    <Box>
      <Dialog
        open={showChangelog}
        onClose={() => {
          dispatch(setShowChangelog(false));
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Whats new with Noizer?</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            {Object.entries(changelog)
              .filter((_, idx) => (showAll ? true : idx < 4))
              .map(([version, changes]) => {
                return (
                  <Box my={2}>
                    <Typography variant="h6">{version}</Typography>
                    {changes.map(change => (
                      <Typography>⚫️ - {change}</Typography>
                    ))}
                    <Box mt={2}>
                      <Divider />
                    </Box>
                  </Box>
                );
              })}
            <Button variant="contained" fullWidth onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Collapse' : 'Show all changelog'}
            </Button>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="default" variant="outlined" onClick={() => dispatch(setDontNotifyChangelog())}>
            Close and dont show again
          </Button>
          <Button color="primary" variant="contained" onClick={() => dispatch(setShowChangelog(false))}>
            Cool! Let me try that
          </Button>
        </DialogActions>
      </Dialog>
      {items.map(item => (
        <Snackbar key={item.id} open anchorOrigin={{ horizontal: 'right', vertical: 'top' }}>
          <Alert elevation={6} variant="filled" onClose={() => handleClose(item.id)} severity={item.type}>
            {item.message}
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
};

export default Notifications;
