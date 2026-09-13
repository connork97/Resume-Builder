import { configureStore } from "@reduxjs/toolkit";

import resumeReducer from "./resumeSlice";
import userReducer from "./userSlice";

import undoable, { excludeAction } from "redux-undo";

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = configureStore({
   reducer: {
      resume: undoable(resumeReducer, {
         groupBy: action => action.meta?.historyGroup ?? null,
         filter: excludeAction([
            // List actions to exclude from undo history here
            "resume/setActiveSectionId",
            "resume/setActiveSectionIds",
            "resume/toggleAllSectionIds",
            "resume/clearActiveSectionIds",
            "resume/setActiveEditorId",
            "resume/setActiveEditorSelection",
            "resume/setResumePrintRef",
         ]),
      }),
      user: userReducer
   },
   // composeEnhancers,
   devTools: {
      maxAge: 25,
   }
});
