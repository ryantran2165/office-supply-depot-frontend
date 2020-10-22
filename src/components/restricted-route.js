import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

export default function RestrictedRoute({
  path,
  component: Component,
  allowSignedIn,
  redirect,
  signedIn,
  navigation: Navigation,
}) {
  return (
    <Route path={path}>
      {allowSignedIn === signedIn ? (
        <React.Fragment>
          {Navigation ? <Navigation /> : ""}
          <Component />
        </React.Fragment>
      ) : (
        <Redirect to={redirect} />
      )}
    </Route>
  );
}

RestrictedRoute.propTypes = {
  path: PropTypes.string,
  component: PropTypes.elementType,
  allowSignedIn: PropTypes.bool,
  redirect: PropTypes.string,
  signedIn: PropTypes.bool,
  navigation: PropTypes.elementType,
};
