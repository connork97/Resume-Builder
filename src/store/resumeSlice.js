import { autoBatchEnhancer, createSlice, nanoid } from "@reduxjs/toolkit";


const createDefaultColumn = (width = '100%') => {
  return {
    id: nanoid(),
    width: width,
    // sections: []
    // children: []
  }
};

// Default Data for Brand New Section
const createDefaultSection = (type = 'defaultSection', columnIndex = 0) => {

  const sectionHeadingDict = {
    header: "Header",
    contact: "Contact",
    skills: "Skills",
    workHistory: "Work History",
    education: "Education",
    summary: "Summary",
    defaultSection: "Default Section"
  };

  const defaultSectionObj = {
    id: nanoid(),
    label: sectionHeadingDict[type],
    type: type,
    styling: {
    },
    layout: {
      columnIndex: columnIndex,
    },
    value: [
      {
        type: "heading",
        children: [
          {
            text: sectionHeadingDict[type],
          }
        ]
      }
    ],
    subsections: [createDefaultSubsection(type)]
  };

  return defaultSectionObj;
};

// Helper function to create standardized fields regardless of section type
const createDefaultField = (arrToMap = ["Field"]) => {

  return (
    arrToMap.map((field) => ({
      id: nanoid(),
      label: field,
      styling: {},
      value: [
        {
          type: "paragraph",
          label: field,
          children: [
            {
              text: "",
            }
          ]
        }
      ],
    }))
  )
};

// Default Subsection Fields (for Initial AND Additional Subsections)
const createDefaultSubsection = (type = 'defaultSubsection', sectionLayout) => {

  const defaultFieldsObj = {
    header: ["Name", "Title"],
    workHistory: ["Job Title", "Company", "Location", "Start/End Dates", "Description"],
    education: ["School", "Degree", "Field of Study", "Location", "Start/End Dates", "Description"],
    skills: ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
    contact: ["Email", "Phone", "Location", "Website", "LinkedIn"],
    summary: ["Summary"],
    defaultSubsection: ["Field"]
  };

  const fields = createDefaultField(defaultFieldsObj[type]);

  const defaultSubsectionObj = {
    id: nanoid(),
    label: type,
    styling: {},
    fields,
    layout: {
      ...sectionLayout,
      children: fields.map((field) => ({
        id: nanoid(),
        type: 'field',
        fieldId: field.id
      }))
    }
  }

  return defaultSubsectionObj;
};

// Resume Slice

const initialState = {
  styling: {
    display: 'flex',
    fontSize: '12px',
    lineHeight: 1.2,
    color: 'rgba(0, 0, 0, 1)',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  layout: {
    columns: [
      createDefaultColumn('100%')
      // children: [sections => sections.filter((section) => section.columnIndex === 0).map(section => section.id)],
    ],
    margin: {
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      left: 'auto'
    },
    padding: {
      top: '3rem',
      right: '3rem',
      bottom: '3rem',
      left: '3rem'
    }
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
    setActiveSectionId(state, action) {
      state.activeSectionId = action.payload;
    },

    setActiveEditorId(state, action) {
      state.activeEditorId = action.payload;
    },

    // For Slate Purposes, sets the currently selected Slate Editor due to there being many different editors on the page at once.
    setActiveEditorSelection(state, action) {
      state.activeEditorSelection = action.payload;
    },

    updateResumeStyling(state, action) {
      state.styling = { ...state.styling, ...action.payload };
      // return action.payload;
    },

    updateResume(state, action) {
      const { key, changes } = action.payload;
      state.layout = { ...state[key], ...changes };
    },

    addColumn(state, action) {
      // const { width } = action.payload;
      const width = state.layout.columns.length === 0 ? '100%' : `${100 / (state.layout.columns.length + 1)}%`;
      state.layout.columns.push(createDefaultColumn(width));
      state.layout.columns.map((column) => {
        column.width = width;
      })
    },

    updateColumn(state, action) {
      const { id, changes } = action.payload;
      const column = state.layout.columns.find((col) => col.id === id);
      if (column) {
        Object.assign(column, changes);
      }
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

    updateSection(state, action) {
      const { sectionId, changes } = action.payload;
      console.log("Updating section", sectionId, changes);
      const section = state.sections.find(s => s.id === sectionId);
      console.log("Found section", section);
      if (section) {
        for (const key in changes) {
          if (key === "styling") {
            section.styling = { ...section.styling, ...changes.styling };
          } else if (key === "layout") {
            section.layout = { ...section.layout, ...changes.layout };
            section.subsections.forEach(sub => {
              sub.layout = { ...sub.layout, ...changes.layout };
            });
          } else {
            section[key] = changes[key];
          }
        }
        // Object.assign(section, changes);
        // section.value = newValue};
      }
    },

    deleteSection(state, action) {
      const sectionId = action.payload;
      const section = state.sections.find(s => s.id === sectionId);
      if (!section) return;

      state.sections = state.sections.filter((s) => s.id !== sectionId);
    },

    reorderSections(state, action) {
      const { fromIndex, toIndex } = action.payload;
      const [moved] = state.sections.splice(fromIndex, 1);
      state.sections.splice(toIndex, 0, moved);
    },

    addSubsection(state, action) {
      const { sectionId } = action.payload;
      const section = state.sections.find(s => s.id === sectionId);

      if (!section) return;

      const type = section.type;

      if (!Array.isArray(section.subsections)) {
        section.subsections = [];
      }

      section.subsections.push({
        ...createDefaultSubsection(type)
      });
    },

    updateSubsection(state, action) {
      const { sectionId, subsectionId, changes } = action.payload;
      const section = state.sections.find(s => s.id === sectionId);
      if (!section) return;

      const subsection = section.subsections.find((s) => s.id === subsectionId);
      if (!subsection) return;

      for (const key in changes) {
        if (key === "styling") {
          subsection.styling = { ...subsection.styling, ...changes.styling };
        } else {
          subsection[key] = changes[key];
        }
      }
    },

    deleteSubsection(state, action) {
      const { sectionId, subsectionId } = action.payload;
      const section = state.sections.find(s => s.id === sectionId);

      if (!section || !Array.isArray(section.subsections)) return;

      section.subsections = section.subsections.filter(
        (sub) => sub.id !== subsectionId
      );
    },

    // Reorder Subsections within a Section via Indexes
    reorderSubsections(state, action) {
      const { sectionId, fromIndex, toIndex } = action.payload;
      const section = state.sections.find(s => s.id === sectionId);

      if (!section) return;

      const arr = section.subsections;
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
    },

    //  Add field to a subsection
    addField(state, action) {
      const { sectionId, subsectionId, fieldData } = action.payload;

      const section = state.sections.find(s => s.id === sectionId);
      if (!section) return;

      const subsection = section.subsections.find((s) => s.id === subsectionId);
      if (!subsection) return;

      subsection.fields.push({
        id: nanoid(),
        label: fieldData?.label ?? "New Field",
        styling: fieldData?.styling ?? {},
        value: fieldData?.value ?? [
          {
            type: "paragraph",
            label: fieldData?.label ?? "New Field",
            children: [
              {
                text: "",
                fontSize: initialState.styling.fontSize,
                lineHeight: initialState.styling.lineHeight
              }
            ]
          }
        ],
      });
    },

    //  Update a field in a subsection
    updateField(state, action) {
      const { sectionId, subsectionId, fieldId, newValue } = action.payload;
      const section = state.sections.find((s) => s.id === sectionId);
      if (!section) return;

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

      const subsection = section.subsections.find((s) => s.id === subsectionId);
      if (!subsection) return;

      subsection.fields = subsection.fields.filter((f) => f.id !== fieldId);
    },

    //  Reorder fields in a subsection
    reorderFields(state, action) {
      const { sectionId, subsectionId, fromIndex, toIndex } = action.payload;
      const section = state.sections.find((s) => s.id === sectionId);
      if (!section) return;

      const subsection = section.subsections.find((s) => s.id === subsectionId);
      if (!subsection) return;

      const arr = subsection.fields;
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
    }
  }
});

export const {
  setActiveSectionId,
  setActiveEditorId,
  setActiveEditorSelection,
  updateResume,
  updateResumeStyling,
  addColumn,
  updateColumn,
  addSection,
  updateSection,
  deleteSection,
  reorderSections,
  addSubsection,
  updateSubsection,
  deleteSubsection,
  reorderSubsections,
  addField,
  updateField,
  deleteField,
  reorderFields
} = resumeSlice.actions;

export default resumeSlice.reducer;