import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import firebase from 'firebase/app';
import 'firebase/auth';
import { AppThunk } from '..';

type UserType = Pick<firebase.User, 'displayName' | 'email' | 'photoURL'>;

const getUser = (): UserType | null => {
  const data = localStorage.getItem('user');
  if (!data) return null;
  return JSON.parse(data);
};

interface AuthState {
  isLoggedIn: boolean;
  user: UserType | null;
  error: string;
}

const initialUser = getUser();

const initialState: AuthState = {
  isLoggedIn: !!initialUser,
  error: '',
  user: initialUser,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logIn: (state, action: PayloadAction<UserType>) => {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.error = '';
    },
    logOut: state => {
      state.isLoggedIn = false;
      state.user = null;
      state.error = '';
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { logIn, logOut, setError } = authSlice.actions;

const saveUser = (data: UserType) => {
  localStorage.setItem('user', JSON.stringify(data));
};

export const googleSignIn = (): AppThunk => dispatch => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(value => {
      console.log(value);
      if (value.user) {
        const user = {
          displayName: value.user.displayName,
          email: value.user.email,
          photoURL: value.user.photoURL,
        };
        dispatch(logIn(user));
        saveUser(user);
      } else dispatch(setError('Login failed'));
    })
    .catch(err => {
      dispatch(setError(err));
    });
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectCount = (state: RootState) => state.counter.value;

export default authSlice.reducer;
