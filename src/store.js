import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers/root-reducer";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { IS_LOCAL } from "./App";

const middleware = [thunk];
if (IS_LOCAL) {
  middleware.push(logger);
}

export default createStore(rootReducer, {}, applyMiddleware(...middleware));
