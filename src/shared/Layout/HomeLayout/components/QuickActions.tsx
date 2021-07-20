import React from 'react';
import { makeStyles, Theme, createStyles, Box } from '@material-ui/core';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@material-ui/lab';
import { Settings, AttachMoneyOutlined } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    speedDial: {
      position: 'fixed',
      '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
        bottom: theme.spacing(3),
        left: theme.spacing(2),
      },
      '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
        top: theme.spacing(2),
        left: theme.spacing(2),
      },
    },
  })
);

const QuickActions = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const actions = [
    { icon: <Settings />, name: 'Settings (Coming soon)', action: () => {} },
    {
      icon: <AttachMoneyOutlined />,
      name: 'Donate',
      action: () => {
        window.open('https://www.patreon.com/noizer', '_blank');
      },
    },
  ];

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <SpeedDial
        ariaLabel="Quick actions"
        className={classes.speedDial}
        icon={
          <SpeedDialIcon
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            icon={
              <Box fontSize={24} textAlign="center">
                🔥
              </Box>
            }
          />
        }
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        direction={'up'}
      >
        {actions.map(action => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => {
              action.action();
              handleClose();
            }}
          />
        ))}
      </SpeedDial>
    </div>
  );
};

export default QuickActions;
