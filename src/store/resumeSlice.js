import { createSlice, nanoid } from "@reduxjs/toolkit";

// Default Data for Brand New Section
const createDefaultSection = (type) => {

  const createDefaultSectionHeading = (headingTitle) => {
    return {
      id: nanoid(),
      type: type,
      label: headingTitle,
      styling: {
        paddingLeft: '2rem',
        paddingRight: '2rem',
        backgroundColor: 'rgba(0, 0, 0, 0)',
      },
      // sectionTitle: headingTitle,
      value: [
        {
          type: "heading",
          children: [{ text: headingTitle, fontSize: '16px', lineHeight: initialState.styling.lineHeight }]
        }
      ],
      subsections: [createDefaultSubsection(type)]
    };
  };

  switch (type) {

    case "header":
      return createDefaultSectionHeading("Header");

    case "contact":
      return createDefaultSectionHeading("Contact");

    case "skills":
      return createDefaultSectionHeading("Skills");

    case "workHistory":
      return createDefaultSectionHeading("Work History");

    case "education":
      return createDefaultSectionHeading("Education");

    case "summary":
      return createDefaultSectionHeading("Summary");

    default:
      return {};
  }
};

// Default Subsection Fields (for Initial AND Additional Subsections)
const createDefaultSubsection = (type) => {
  const defaultHeaderFieldsArr = ["Name", "Title"];
  const defaultWorkHistoryFieldsArr = ["Job Title", "Company", "Location", "Start Date", "End Date", "Description"];
  const defaultEducationFieldsArr = ["School", "Degree", "Field of Study", "Location", "Start Date", "End Date", "Description"];
  const defaultSkillsFieldsArr = ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"];
  const defaultContactFieldsArr = ["Email", "Phone", "Location", "Website", "LinkedIn"];
  const defaultSummaryFieldsArr = ["Summary"];

  // Helper function to create standardized fields regardless of section type
  const createDefaultFields = (arrToMap) => {
    return (
      arrToMap.map((field) => ({
        id: nanoid(),
        label: field,
        styling: {},
        value: [
          {
            type: "paragraph",
            children: [{ text: "", fontSize: initialState.styling.fontSize, lineHeight: initialState.styling.lineHeight }]
          }
        ]
      }))
    )
  };

  switch (type) {
    case "header":
      return {
        id: nanoid(),
        styling: {},
        fields: createDefaultFields(defaultHeaderFieldsArr)
      };

    case "workHistory":
      return {
        id: nanoid(),
        styling: { justifyContent: 'space-between' },
        fields: createDefaultFields(defaultWorkHistoryFieldsArr)
      };

    case "education":
      return {
        id: nanoid(),
        styling: { justifyContent: 'space-between' },
        fields: createDefaultFields(defaultEducationFieldsArr),
      };

    case "skills":
      return {
        id: nanoid(),
        styling: { justifyContent: 'space-between' },
        // styling: { display: 'flex', justifyContent: 'space-between' },
        fields: createDefaultFields(defaultSkillsFieldsArr),
      };

    case "contact":
      return {
        id: nanoid(),
        styling: { justifyContent: 'space-between' },
        fields: createDefaultFields(defaultContactFieldsArr)
      };

    case "summary":
      return {
        id: nanoid(),
        styling: {},
        fields: createDefaultFields(defaultSummaryFieldsArr)
      };

    default:
      return { id: nanoid(), styling: {}, fields: createDefaultFields(["Field"]) };
  }
};

// Resume Slice

const initialState = {
  styling: {
    fontSize: '12px',
    lineHeight: 1.2,
    // color: 'rgba(0, 0, 0, 1)',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    // fontWeight: 400,
    // gap: 0
  },
  sections: [],
  activeSectionId: null,
  activeEditorId: null,
  activeEditorSelection: null
};

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    setActiveSection(state, action) {
      state.activeSectionId = action.payload;
    },

    setActiveEditorId(state, action) {
      state.activeEditorId = action.payload;
    },

    setActiveEditorSelection(state, action) {
      state.activeEditorSelection = action.payload;
    },

    updateResumeStyling(state, action) {
      state.styling = { ...state.styling, ...action.payload };
      // return action.payload;
    },

    addSection: {
      reducer(state, action) {
        state.sections.push(action.payload);
      },
      prepare(type) {
        return {
          payload: createDefaultSection(type)
        };
      }
    },

    // updateSection(state, action) {
    //   const { id, changes } = action.payload;
    //   const section = state.sections.find((s) => s.id === id);
    //   if (section) Object.assign(section, changes);

    updateSection(state, action) {
      const { sectionId, changes } = action.payload;
      const section = state.sections.find(s => s.id === sectionId);
      if (section) {
        for (const key in changes) {
          if (key === "styling") {
            section.styling = { ...section.styling, ...changes.styling };
          } else {
            section[key] = changes[key];
          }
        }
        // Object.assign(section, changes);
        // section.value = newValue};
      }
    },
    // if (section) Object.assign(section, newValue);
    // if (section) {
    // for (const key in changes) {
    // if (key === "styling") {
    // section.styling = { ...section.styling, ...changes.styling };
    // } else {
    // section[key] = changes[key];
    // }
    // }
    // }

    deleteSection(state, action) {
      state.sections = state.sections.filter((s) => s.id !== action.payload);
    },

    reorderSections(state, action) {
      const { fromIndex, toIndex } = action.payload;
      const [moved] = state.sections.splice(fromIndex, 1);
      state.sections.splice(toIndex, 0, moved);
    },

    addSubsection(state, action) {
      const { sectionId } = action.payload;
      const section = state.sections.find((s) => s.id === sectionId);
      if (!section) return;

      const type = section.type;

      if (!Array.isArray(section.data.subsections)) {
        section.data.subsections = [];
      }

      section.data.subsections.push({
        id: nanoid(),
        // ...subsectionData
        ...createDefaultSubsection(type)

      });
    },

    deleteSubsection(state, action) {
      const { sectionId, subsectionId } = action.payload;
      const section = state.sections.find((s) => s.id === sectionId);
      if (!section || !Array.isArray(section.data.subsections)) return;

      section.data.subsections = section.data.subsections.filter(
        (sub) => sub.id !== subsectionId
      );
    },

    reorderSubsections(state, action) {
      const { sectionId, fromIndex, toIndex } = action.payload;
      const section = state.sections.find((s) => s.id === sectionId);
      if (!section || !Array.isArray(section.data.subsections)) return;

      const arr = section.data.subsections;
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
    },

    //  Add field to a subsection
    addField(state, action) {
      const { sectionId, subsectionId, fieldData } = action.payload;
      const section = state.sections.find((s) => s.id === sectionId);
      if (!section) return;

      const subsection = section.data.subsections.find((s) => s.id === subsectionId);
      if (!subsection) return;

      subsection.fields.push({
        id: nanoid(),
        ...fieldData
      });
    },

    //  Update a field in a subsection
    updateField(state, action) {
      const { sectionId, subsectionId, fieldId, newValue } = action.payload;
      const section = state.sections.find((s) => s.id === sectionId);
      if (!section) return;

      // const subsection = section.data.subsections.find((s) => s.id === subsectionId);
      const subsection = section.subsections.find((s) => s.id === subsectionId);
      if (!subsection) return;

      const field = subsection.fields.find((f) => f.id === fieldId);
      if (field) field.value = newValue;
    },

    //  Delete a field in a subsection
    deleteField(state, action) {
      const { sectionId, subsectionId, fieldId } = action.payload;
      const section = state.sections.find((s) => s.id === sectionId);
      if (!section) return;

      const subsection = section.data.subsections.find((s) => s.id === subsectionId);
      if (!subsection) return;

      subsection.fields = subsection.fields.filter((f) => f.id !== fieldId);
    },

    //  Reorder fields in a subsection
    reorderFields(state, action) {
      const { sectionId, subsectionId, fromIndex, toIndex } = action.payload;
      const section = state.sections.find((s) => s.id === sectionId);
      if (!section) return;

      const subsection = section.data.subsections.find((s) => s.id === subsectionId);
      if (!subsection) return;

      const arr = subsection.fields;
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
    }
  }
});

export const {
  setActiveSection,
  setActiveEditorId,
  setActiveEditorSelection,
  updateResumeStyling,
  addSection,
  updateSection,
  deleteSection,
  reorderSections,
  addSubsection,
  deleteSubsection,
  reorderSubsections,
  addField,
  updateField,
  deleteField,
  reorderFields
} = resumeSlice.actions;

export default resumeSlice.reducer;