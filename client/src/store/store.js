import { configureStore } from "@reduxjs/toolkit";

import resumeReducer from "./resumeSlice";
import userReducer from "./userSlice";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
    user: userReducer
  },
  composeEnhancers,
  devTools: {
    maxAge: 25,
  }
});