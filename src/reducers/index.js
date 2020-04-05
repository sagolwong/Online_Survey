import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import setPageReducer from "./setPageReducer";
import surveyReducer from "./surveyReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  statusPage: setPageReducer,
  survey: surveyReducer
});