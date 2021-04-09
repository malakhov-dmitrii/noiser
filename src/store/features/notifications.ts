import { Color } from '@material-ui/lab';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { version } from '../../../package.json';
import { AppThunk, RootState } from '../index';

interface Notification {
  type: Color;
  message: string;
  preventAutoDismiss?: boolean;
}

export interface NotificationItem extends Notification {
  id: number;
}

interface NotificationsState {
  items: NotificationItem[];
  savedVersion: string | null;
  showChangelog: boolean;
  dontNotifyChangelog: boolean | null;
}

const defaultDelay = 3000;

const initialState: NotificationsState = {
  items: [],
  savedVersion: localStorage.getItem('app_version'),
  showChangelog: false,
  dontNotifyChangelog: !!localStorage.getItem('dontNotifyChangelog'),
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    fireEvent: (state, action: PayloadAction<NotificationItem>) => {
      state.items = [...state.items, action.payload];
    },
    dismiss: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    pop: state => {
      const newState = state.items.slice();
      newState.shift();
      state.items = newState;
    },
    setShowChangelog: (state, action: PayloadAction<boolean>) => {
      if (!state.dontNotifyChangelog) {
        state.showChangelog = action.payload;
      }
    },
    setDontNotifyChangelog: state => {
      state.showChangelog = false;
      state.dontNotifyChangelog = true;
      localStorage.setItem('dontNotifyChangelog', 'true');
    },
    updateVersion: state => {
      state.savedVersion = version;
      localStorage.setItem('app_version', version);
    },
  },
});

export const { fireEvent, dismiss, pop, setShowChangelog, setDontNotifyChangelog, updateVersion } = notificationsSlice.actions;

export const emit = (message: string, color: Color, preventAutoDismiss = false): AppThunk => (dispatch, getState) => {
  const state = getState();
  const lastItem = state.notifications.items[state.notifications.items.length - 1];
  const lastId = lastItem?.id + 1 || 1;
  dispatch(fireEvent({ message, type: color, id: lastId }));
  if (!preventAutoDismiss) {
    setTimeout(() => {
      dispatch(dismiss(lastId));
    }, defaultDelay);
  }
};

export const compareChanges = (): AppThunk => (dispatch, getState) => {
  const savedVersion = getState().notifications.savedVersion;
  if (!savedVersion) {
    dispatch(updateVersion());
  } else if (savedVersion !== version) {
    dispatch(updateVersion());
    dispatch(setShowChangelog(true));
  }
};

export const selectNotifications = (state: RootState): NotificationsState => state.notifications;

export default notificationsSlice.reducer;
