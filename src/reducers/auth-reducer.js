import { SET_SIGNED_IN, SET_USER } from "../actions/types";

const initialState = {
  signedIn: localStorage.getItem("token") ? true : false,
  user: null,
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
    default:
      return state;
  }
}
