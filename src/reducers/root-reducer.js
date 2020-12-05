import { combineReducers } from "redux";
import { withReduxStateSync } from "redux-state-sync";
import authReducer from "./auth-reducer";
import productsReducer from "./products-reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
});

export default withReduxStateSync(rootReducer);
