import { combineReducers } from "redux";
import authReducer from "./auth-reducer";
import productsReducer from "./products-reducer";

export default combineReducers({
  auth: authReducer,
  products: productsReducer,
});
