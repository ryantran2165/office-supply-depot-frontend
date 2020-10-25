import { SET_QUERY } from "../actions/types";

const initialState = {
  query: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_QUERY:
      return {
        ...state,
        query: action.payload,
      };
    default:
      return state;
  }
}
