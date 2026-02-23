import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  sections: []
};

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    addSection: {
      reducer(state, action) {
        state.sections.push(action.payload);
      },
      prepare(type, columnIndex = 0) {
        return {
          payload: {
            id: nanoid(),
            type,
            columnIndex,
            data: {} // will be filled based on type
          }
        };
      }
    },

    updateSection(state, action) {
      const { id, changes } = action.payload;
      const section = state.sections.find(s => s.id === id);
      if (section) Object.assign(section, changes);
    },

    deleteSection(state, action) {
      state.sections = state.sections.filter(s => s.id !== action.payload);
    },

    reorderSections(state, action) {
      const { fromIndex, toIndex } = action.payload;
      const [moved] = state.sections.splice(fromIndex, 1);
      state.sections.splice(toIndex, 0, moved);
    }
  }
});

export const { addSection, updateSection, deleteSection, reorderSections } =
  resumeSlice.actions;

export default resumeSlice.reducer;