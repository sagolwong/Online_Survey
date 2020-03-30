import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import setPageReducer from "./setPageReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  statusPage: setPageReducer
});