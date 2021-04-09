import React from 'react';

import { Box, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationItem, dismiss, selectNotifications } from '../../store/features/notifications';

const Notifications = () => {
  const items: NotificationItem[] = useSelector(selectNotifications);
  const dispatch = useDispatch();

  const handleClose = (id: number) => {
    dispatch(dismiss(id));
  };

  return (
    <Box>
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
