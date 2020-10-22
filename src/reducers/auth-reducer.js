import {
  SET_SIGNED_IN,
  SET_USER,
  SET_DRIVER_SIGNED_IN,
  SET_DRIVER,
} from "../actions/types";

const initialState = {
  signedIn: localStorage.getItem("token") ? true : false,
  user: null,
  driverSignedIn: localStorage.getItem("driver-token") ? true : false,
  driver: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_SIGNED_IN:
      return {
        ...state,
        signedIn: action.payload,
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case SET_DRIVER_SIGNED_IN:
      return {
        ...state,
        driverSignedIn: action.payload,
      };
    case SET_DRIVER:
      return {
        ...state,
        driver: action.payload,
      };
    default:
      return state;
  }
}
