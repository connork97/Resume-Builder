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
            data: [
               {
                    sectionTitle: "Work History",
                    sectionAdditionalDetails: "",
                    subsections: [
                         {
                              subsectionTitle: "Employer 1",
                              subsectionDate: "Jan 2020 - Present",
                              subsectionLocation: "Los Angeles, CA",
                              subsectionAdditionalDetails: "",
                              subsectionContent: [
                                   "Bullet point text here, talking about the job.",
                                   "Second bullet point text here",
                                   "Even more bullet point text."
                              ]
                         },
                         {
                              subsectionTitle: "Employer 2",
                              subsectionDate: "Jan 2018 - December 2019",
                              subsectionLocation: "San Francisco, CA",
                              subsectionContent: [
                                   "Bullet point text here, talking about the job.",
                                   "Second bullet point text here",
                                   "Even more bullet point text."
                              ]
                         },
                    ]
               },
               {
                    sectionTitle: "Education",
                    sectionAdditionalDetails: "",
                    subsections: [
                         {
                              subsectionTitle: "UCLA",
                              subsectionDate: "Jun 2016",
                              subsectionLocation: "Los Angeles, CA",
                              subsectionAdditionalDetails: "Software Engineering",  // Example of an extra type that may be left blank in other subsections.  In this case, it's field of study
                              subsectionMoreAdditionalDetails: "Bachelor of Arts",  // Example of an extra type that may be left blank in other subsections.  In this case, it's degree
                              subsectionContent: [
                                   "Bullet point text here, talking about the job.",
                                   "Second bullet point text here",
                                   "Even more bullet point text."
                              ]
                         },
                         {
                              subsectionTitle: "Employer 2",
                              subsectionDate: "Jan 2018 - December 2019",
                              subsectionLocation: "San Francisco, CA",
                              subsectionContent: [
                                   "Bullet point text here, talking about the job.",
                                   "Second bullet point text here",
                                   "Even more bullet point text."
                              ]
                         },
                    ]
               },
          ] // will be filled based on type
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