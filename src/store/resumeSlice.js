import { createSlice, nanoid } from "@reduxjs/toolkit";

const createDefaultData = (type) => {
  switch (type) {
    case "header":
      return {
        name: "",
        title: ""
      };

    case "contact":
      return {
        sectionTitle: "Contact",
        email: "",
        phone: "",
        location: "",
        website: "",
        linkedIn: ""
      };

    case "summary":
      return {
        sectionTitle: "Summary",
        content: ""
      };

    case "skills":
      return {
        sectionTitle: "Skills",
        skillsList: []   // array of strings
      };

    case "workHistory":
      return {
        sectionTitle: "Work History",
        sectionAdditionalDetails: "",
        subsections: []   // each subsection = job entry
      };

    case "education":
      return {
        sectionTitle: "Education",
        sectionAdditionalDetails: "",
        subsections: []   // each subsection = school entry
      };

    default:
      return {};
  }
};

const initialState = {
  sections: []
};

const createDefaultSubsection = (type) => {
  switch (type) {
    case "workHistory":
      return {
        jobTitle: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: ""
      };

    case "education":
      return {
        school: "",
        degree: "",
        field: "",
        startYear: "",
        endYear: "",
        description: ""
      };

    default:
      return {};
  }
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
        const baseData = createDefaultData(type);
        return {
          payload: {
            id: nanoid(),
            type,
            columnIndex,
            data: {
              ...baseData,
              subsections: createDefaultData(type).subsections
                ? [
                    {
                      id: nanoid(),
                      ...createDefaultSubsection(type)
                    }
                  ]
                : undefined
            }
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
    },

    addSubsection(state, action) {
      const { sectionId, subsectionData } = action.payload;
      const section = state.sections.find(s => s.id === sectionId);
      if (!section) return;

      section.data.subsections.push({
        id: nanoid(),
        ...subsectionData
      });
    }

  }
});

export const { addSection, updateSection, deleteSection, reorderSections, addSubsection } =
  resumeSlice.actions;

export default resumeSlice.reducer;