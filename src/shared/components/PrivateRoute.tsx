import React from 'react';

import { isEmpty, isLoaded } from 'react-redux-firebase';
import { Redirect, Route } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated or if auth is not
// yet loaded
const PrivateRoute = ({ children, ...rest }: { [x: string]: any; children: any }) => {
  const auth = useAppSelector(state => state.firebase.auth);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoaded(auth) && !isEmpty(auth) ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
export default PrivateRoute;
