import { SET_QUERY, SET_CATEGORY, SET_SUBCATEGORY } from "../actions/types";

const initialState = {
  query: "",
  category: "",
  subcategory: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_QUERY:
      return {
        ...state,
        query: action.payload,
      };
    case SET_CATEGORY:
      return {
        ...state,
        category: action.payload,
      };
    case SET_SUBCATEGORY:
      return {
        ...state,
        subcategory: action.payload,
      };
    default:
      return state;
  }
}
