import { combineReducers } from "redux";
import authReducer from "./auth/authSlice";
import themeReducer from "../theme/themeReducer";

/* --------------------------- Root Reducer ------------------------------ */
const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
});

/* --------------------------- Root State Type --------------------------- */
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
