import {
  SET_SIGNED_IN,
  SET_USER,
  SET_DRIVER_SIGNED_IN,
  SET_DRIVER,
} from "./types";
import axios from "axios";
import { API_URL } from "../App";

export const checkSignedIn = () => (dispatch) => {
  // Called on mount (load/refresh)
  const header = {
    headers: {
      Authorization: `JWT ${localStorage.getItem("token")}`,
    },
  };
  axios
    .get(`${API_URL}/users/current-user/`, header)
    .then((res) => {
      // Token not expired, set user
      dispatch({
        type: SET_USER,
        payload: res.data,
      });
    })
    .catch(() => {
      // Token expired or not signed in, force sign out
      localStorage.removeItem("token");
      dispatch({
        type: SET_SIGNED_IN,
        payload: false,
      });
    });
};

export const signIn = (data) => (dispatch) => {
  axios
    .post(`${API_URL}/token-auth/`, data)
    .then((res) => {
      // Sign in success, save token and state
      localStorage.setItem("token", res.data.token);
      dispatch({
        type: SET_SIGNED_IN,
        payload: true,
      });
      dispatch({
        type: SET_USER,
        payload: res.data.user,
      });
    })
    .catch((err) => {
      // Invalid email/password
      const error = err.response.data.non_field_errors[0];
      if (error === "Unable to log in with provided credentials.") {
        alert("Invalid email/password, please try again.");
      }
    });
};

export const signUp = (data) => (dispatch) => {
  axios
    .post(`${API_URL}/users/user-list/`, data)
    .then((res) => {
      // Sign up success, save token and state
      localStorage.setItem("token", res.data.token);
      dispatch({
        type: SET_SIGNED_IN,
        payload: true,
      });
      dispatch({
        type: SET_USER,
        payload: res.data,
      });
    })
    .catch((err) => {
      // User with email already exists
      const error = err.response.data.email[0];
      if (error === "user with this email address already exists.") {
        alert("User with this email already exists, please try again.");
      }
    });
};

export const signOut = () => (dispatch) => {
  // Delete token and reset state
  localStorage.removeItem("token");
  dispatch({
    type: SET_SIGNED_IN,
    payload: false,
  });
  dispatch({
    type: SET_USER,
    payload: null,
  });
};

export const checkDriverSignedIn = () => (dispatch) => {
  // Called on mount (load/refresh)
  const header = {
    headers: {
      Authorization: `JWT ${localStorage.getItem("driver-token")}`,
    },
  };
  axios
    .get(`${API_URL}/users/current-user/`, header)
    .then((res) => {
      // Token not expired, set driver
      dispatch({
        type: SET_DRIVER,
        payload: res.data,
      });
    })
    .catch(() => {
      // Token expired or not signed in, force sign out
      localStorage.removeItem("driver-token");
      dispatch({
        type: SET_DRIVER_SIGNED_IN,
        payload: false,
      });
    });
};

export const driverSignIn = (data) => (dispatch) => {
  axios
    .post(`${API_URL}/token-auth/`, data)
    .then((res) => {
      if (res.data.user.is_driver) {
        // Sign in success, save driver token and state
        localStorage.setItem("driver-token", res.data.token);
        dispatch({
          type: SET_DRIVER_SIGNED_IN,
          payload: true,
        });
        dispatch({
          type: SET_DRIVER,
          payload: res.data.user,
        });
      } else {
        // Correct credentials but not driver
        alert("Invalid email/password, please try again.");
      }
    })
    .catch((err) => {
      // Invalid email/password
      const error = err.response.data.non_field_errors[0];
      if (error === "Unable to log in with provided credentials.") {
        alert("Invalid email/password, please try again.");
      }
    });
};

export const driverSignOut = () => (dispatch) => {
  // Delete token and reset state
  localStorage.removeItem("driver-token");
  dispatch({
    type: SET_DRIVER_SIGNED_IN,
    payload: false,
  });
  dispatch({
    type: SET_DRIVER,
    payload: null,
  });
};
