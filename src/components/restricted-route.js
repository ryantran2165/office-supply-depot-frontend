import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RestrictedRoute({
  path,
  component: Component,
  allowSignedIn,
  redirect,
}) {
  // Get signedIn state from store
  const signedIn = useSelector((state) => state.auth.signedIn);

  return (
    <Route path={path}>
      {allowSignedIn === signedIn ? <Component /> : <Redirect to={redirect} />}
    </Route>
  );
}

RestrictedRoute.propTypes = {
  path: PropTypes.string,
  component: PropTypes.elementType,
  allowSignedIn: PropTypes.bool,
  redirect: PropTypes.string,
};
