import { SET_QUERY, SET_CATEGORY, SET_SUBCATEGORY } from "./types";

export const setQuery = (query) => (dispatch) => {
  dispatch({
    type: SET_QUERY,
    payload: query,
  });
};

export const setCategory = (category) => (dispatch) => {
  dispatch({
    type: SET_CATEGORY,
    payload: category,
  });
};

export const setSubcategory = (subcategory) => (dispatch) => {
  dispatch({
    type: SET_SUBCATEGORY,
    payload: subcategory,
  });
};
