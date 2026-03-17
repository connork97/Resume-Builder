import { createSlice, nanoid } from "@reduxjs/toolkit";

// Default Data for Brand New Section
const createDefaultSection = (type) => {
  const defaultStyling = {
    // textAlign: 'center',
    paddingLeft: '2rem',
    paddingRight: '2rem',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  }
  // const createDefaultSectionHeading = (headingTitle) => {
  //   return {
  //     id: nanoid(),
  //     styling: { ...defaultStyling },
  //     sectionTitle: headingTitle,
  //     value: [
  //       {
  //         type: "heading",
  //         children: [{ text: headingTitle }]
  //       }
  //     ],
  //     subsections: [createDefaultSubsection(type)]
  //   };
  // };
  switch (type) {
    case "header":
      return {
        id: nanoid(),
        styling: { ...defaultStyling },
        sectionTitle: "Header",
        value: [
          {
            type: "heading",
            children: [{ text: "Header" }]
          }
        ],
        subsections: [createDefaultSubsection("header")]
      };

    case "contact":
      return {
        id: nanoid(),
        sectionTitle: "Contact",
        styling: { ...defaultStyling },
        // styling: {
        //   display: 'flex',
        //   flexDirection: 'row',
        //   justifyContent: 'space-evenly',
        //   flexWrap: 'wrap',
        //   alignItems: 'center',
        // },
        value: [
          {
            type: "heading",
            children: [{ text: "Contact" }]
          }
        ],
        subsections: [createDefaultSubsection("contact")]
        // subsections: [
          // {
            // id: nanoid(),
            // styling: {},
            // fields: defaultContactFieldsArr.map((field) => ({
            //   id: nanoid(),
            //   label: field,
            //   styling: {},
            //   value: [
            //     {
            //       type: "paragraph",
            //       children: [{ text: "" }]
            //     }
            //   ]
            // }))
          // },
        // ]
      };

    case "skills":
      return {
        id: nanoid(),
        sectionTitle: "Skills",
        styling: { ...defaultStyling },
        value: [
          {
            type: "heading",
            children: [{ text: "Skills" }]
          }
        ],
        subsections: [createDefaultSubsection("skills")]
      };

    case "workHistory":
      return {
        id: nanoid(),
        sectionTitle: "Work History",
        styling: { ...defaultStyling },
        value: [
          {
            type: "heading",
            children: [{ text: "Work History" }]
          }
        ],
        subsections: [createDefaultSubsection("workHistory")]
      };

    case "education":
      return {
        id: nanoid(),
        styling: { ...defaultStyling },
        sectionTitle: "Education",
        value: [
          {
            type: "heading",
            children: [{ text: "Education" }]
          }
        ], 
        subsections: [createDefaultSubsection("education")]
      };

    case "summary":
      return {
        id: nanoid(),
        sectionTitle: "Summary",
        styling: { ...defaultStyling },
        value: [
          {
            type: "heading",
            children: [{ text: "Summary" }]
          }
        ],
        subsections: [createDefaultSubsection("summary")]
      };

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
            children: [{ text: "" }]
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
    lineHeight: '1.2',
    color: 'rgba(0, 0, 0, 1)',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    fontWeight: 400,
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
      // prepare(type, columnIndex = 0) {
        const baseData = createDefaultSection(type);

        let data = { ...baseData };

        // If the section type uses subsections but has none, create the first one
        // if (Array.isArray(baseData.subsections) && baseData.subsections.length === 0) {
        //   data = {
        //     ...baseData,
        //     subsections: [
        //       {
        //         id: nanoid(),
        //         ...createDefaultSubsection(type)
        //       }
        //     ]
        //   };
        // }

        return {
          payload: {
            id: nanoid(),
            type,
            // columnIndex,
            data
          }
        };
      }
    },

    // updateSection(state, action) {
    //   const { id, changes } = action.payload;
    //   const section = state.sections.find((s) => s.id === id);
    //   if (section) Object.assign(section, changes);
    // },
    updateSection(state, action) {
      const { id, changes } = action.payload;
      const section = state.sections.find(s => s.id === id);
      console.log("SECTION FOR REAL: ", section)

      if (section) {
        for (const key in changes) {
          if (key === "styling") {
            section.styling = { ...section.styling, ...changes.styling };
          } else {
            section[key] = changes[key];
          }
        }
      }
    },

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

      const subsection = section.data.subsections.find((s) => s.id === subsectionId);
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