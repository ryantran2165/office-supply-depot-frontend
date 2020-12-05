import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers/root-reducer";
import thunk from "redux-thunk";
import logger from "redux-logger";
import {
  createStateSyncMiddleware,
  initMessageListener,
} from "redux-state-sync";
import { SET_QUERY, SET_CATEGORY, SET_SUBCATEGORY } from "./actions/types";
import { IS_LOCAL } from "./App";

const config = {
  blacklist: [SET_QUERY, SET_CATEGORY, SET_SUBCATEGORY],
};

const middleware = [thunk, createStateSyncMiddleware(config)];
if (IS_LOCAL) {
  middleware.push(logger);
}

const store = createStore(rootReducer, {}, applyMiddleware(...middleware));
initMessageListener(store);

export default store;
