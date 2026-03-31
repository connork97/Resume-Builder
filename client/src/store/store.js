import { configureStore } from "@reduxjs/toolkit";

import resumeReducer from "./resumeSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
    user: userReducer
  }
});