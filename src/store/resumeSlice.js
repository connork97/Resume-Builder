import { createSlice, nanoid } from "@reduxjs/toolkit";

// Default Data for Brand New Section
const createDefaultSection = (type) => {
  const defaultStyling = {
    // textAlign: 'center',
    paddingLeft: '2rem',
    paddingRight: '2rem',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  }
  switch (type) {
    case "header":
      return {
        sectionTitle: "Header",
        value: "Header",
        id: nanoid(),
        styling: {...defaultStyling},
        subsections: []
      };

    case "contact":
      return {
        sectionTitle: "Contact",
        styling: {...defaultStyling},
        subsections: [
          {
            id: nanoid(),
            styling: {
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              flexWrap: 'wrap',
              alignItems: 'center',
            },
            fields: [
              {
                id: nanoid(),
                key: "value",
                label: "Email",
                styling: {},
                value: [
                  {
                    type: "paragraph",
                    children: [{ text: "" }]
                  }
                ]
              },
              {
                id: nanoid(),
                key: "value",
                label: "Phone",
                styling: {},
                value: [
                  {
                    type: "paragraph",
                    children: [{ text: "" }]
                  }
                ]
              },
              {
                id: nanoid(),
                key: "value",
                label: "Location",
                styling: {},
                value: [
                  {
                    type: "paragraph",
                    children: [{ text: "" }]
                  }
                ]
              },
              {
                id: nanoid(),
                key: "value",
                label: "Website",
                styling: {},
                value: [
                  {
                    type: "paragraph",
                    children: [{ text: "" }]
                  }
                ]
              },
              {
                id: nanoid(),
                key: "value",
                label: "LinkedIn",
                styling: {},
                value: [
                  {
                    type: "paragraph",
                    children: [{ text: "" }]
                  }
                ]
              }
            ]
          },
        ]
      };

    case "skills":
      return {
        sectionTitle: "Skills",
        styling: {...defaultStyling},
        subsections: []
      };

    case "workHistory":
      return {
        sectionTitle: "Work History",
        styling: {...defaultStyling},
        subsections: []
      };

    case "education":
      return {
        sectionTitle: "Education",
        styling: {...defaultStyling},
        subsections: []
      };

    case "summary":
      return {
        sectionTitle: "Summary",
        styling: {...defaultStyling},
        subsections: [
          {
            id: nanoid(),
            styling: {},
            fields: [
              {
                id: nanoid(),
                key: "description",
                label: "Summary",
                styling: {},
                value: [
                  {
                    type: "paragraph",
                    children: [{ text: "" }]
                  }
                ]
              }
            ]
          }
        ]
      };

    default:
      return {};
  }
};

// Default Subsection Fields (for Initial AND Additional Subsections)
const createDefaultSubsection = (type) => {
  switch (type) {

    case "header":
      return {
        styling: {},
        fields: [
          {
            id: nanoid(),
            key: "name",
            label: "Name",
            styling: {},
            value: [
              {
                type: "paragraph",
                children: [{ text: "" }]
              }
            ]
          },
          {
            id: nanoid(),
            key: "title",
            label: "Title",
            styling: {},
            value: [
              {
                type: "paragraph",
                children: [{ text: "" }]
              }
            ]
          },
        ]
      };

    case "workHistory":
      return {
        styling: { justifyContent: 'space-between' },
        fields: [
          {
            id: nanoid(),
            key: "jobTitle",
            label: "Job Title",
            styling: {},
            value: [
              {
                type: "paragraph",
                children: [{ text: "" }]
              }
            ]
          },
          {
            id: nanoid(),
            key: "company",
            label: "Company",
            styling: {},
            value: [
              {
                type: "paragraph",
                children: [{ text: "" }]
              }
            ]
          },
          {
            id: nanoid(),
            key: "location",
            label: "Location",
            styling: {},
            value: [
              {
                type: "paragraph",
                children: [{ text: "" }]
              }
            ]
          },
          {
            id: nanoid(),
            key: "startDate",
            label: "Start Date",
            styling: {},
            value: [
              {
                type: "paragraph",
                children: [{ text: "" }]
              }
            ]
          },
          {
            id: nanoid(),
            key: "endDate",
            label: "End Date",
            styling: {},
            value: [
              {
                type: "paragraph",
                children: [{ text: "" }]
              }
            ]
          },
          {
            id: nanoid(),
            key: "description",
            label: "Description",
            styling: {},
            value: [
              {
                type: "paragraph",
                children: [{ text: "" }]
              }
            ]
          }
        ]
      };

    case "education":
      return {
        styling: { justifyContent: 'space-between' },
        fields: [
          {
            id: nanoid(),
            key: "school",
            label: "School",
            styling: {},
            value: [
              {
                type: "paragraph",
                children: [{ text: "" }]
              }
            ]
          },
          {
            id: nanoid(),
            key: "degree",
            label: "Degree",
            styling: {},
            value: [
              {
                type: "paragraph",
                children: [{ text: "" }]
              }
            ]
          },
          {
            id: nanoid(),
            key: "field",
            label: "Field of Study",
            styling: {},
            value: [
              {
                type: "paragraph",
                children: [{ text: "" }]
              }
            ]
          },
          {
            id: nanoid(),
            key: "location",
            label: "Location",
            styling: {},
            value: [
              {
                type: "paragraph",
                children: [{ text: "" }]
              }
            ]
          },
          {
            id: nanoid(),
            key: "startDate",
            label: "Start Date",
            styling: {},
            value: [
              {
                type: "paragraph",
                children: [{ text: "" }]
              }
            ]
          },
          {
            id: nanoid(),
            key: "endDate",
            label: "End Date",
            styling: {},
            value: [
              {
                type: "paragraph",
                children: [{ text: "" }]
              }
            ]
          },
          {
            id: nanoid(),
            key: "description",
            label: "Description",
            styling: {},
            value: [
              {
                type: "paragraph",
                children: [{ text: "" }]
              }
            ]
          }
        ]
      };

    case "skills":
      return {
        styling: { display: 'flex', justifyContent: 'space-between' },
        fields: [
          {
            id: nanoid(),
            key: "skill",
            label: "Skill",
            styling: {},
            value: [
              {
                type: "paragraph",
                children: [{ text: "" }]
              }
            ]
          },
          {
            id: nanoid(),
            key: "skill",
            label: "Skill",
            styling: {},
            value: [
              {
                type: "paragraph",
                children: [{ text: "" }]
              }
            ]
          },
          {
            id: nanoid(),
            key: "skill",
            label: "Skill",
            styling: {},
            value: [
              {
                type: "paragraph",
                children: [{ text: "" }]
              }
            ]
          },
          {
            id: nanoid(),
            key: "skill",
            label: "Skill",
            styling: {},
            value: [
              {
                type: "paragraph",
                children: [{ text: "" }]
              }
            ]
          },
          {
            id: nanoid(),
            key: "skill",
            label: "Skill",
            styling: {},
            value: [
              {
                type: "paragraph",
                children: [{ text: "" }]
              }
            ]
          }
        ]
      };

    case "contact":
      return {
        styling: { justifyContent: 'space-evenly' },
        fields: [
          {
            id: nanoid(),
            key: "value",
            label: "Contact",
            styling: {},
            value: [
              {
                type: "paragraph",
                children: [{ text: "" }]
              }
            ]
          },
          {
            id: nanoid(),
            key: "value",
            label: "Contact",
            styling: {},
            value: [
              {
                type: "paragraph",
                children: [{ text: "" }]
              }
            ]
          },
          {
            id: nanoid(),
            key: "value",
            label: "Contact",
            styling: {},
            value: [
              {
                type: "paragraph",
                children: [{ text: "" }]
              }
            ]
          },
          {
            id: nanoid(),
            key: "value",
            label: "Contact",
            styling: {},
            value: [
              {
                type: "paragraph",
                children: [{ text: "" }]
              }
            ]
          },
          {
            id: nanoid(),
            key: "value",
            label: "Contact",
            styling: {},
            value: [
              {
                type: "paragraph",
                children: [{ text: "" }]
              }
            ]
          }
        ]
      };

    case "summary":
      return {
        styling: {},
        fields: [
          {
            id: nanoid(),
            key: "description",
            label: "Summary",
            styling: {},
            value: [
              {
                type: "paragraph",
                children: [{ text: "" }]
              }
            ]
          }
        ]
      };

    default:
      return { styling: {}, fields: [] };
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
      // console.log('TEST')
      state.styling = { ...state.styling, ...action.payload };
      // return action.payload;
    },

    addSection: {
      reducer(state, action) {
        state.sections.push(action.payload);
      },
      prepare(type, columnIndex = 0) {
        const baseData = createDefaultSection(type);

        let data = { ...baseData };

        // If the section type uses subsections but has none, create the first one
        if (Array.isArray(baseData.subsections) && baseData.subsections.length === 0) {
          data = {
            ...baseData,
            subsections: [
              {
                id: nanoid(),
                ...createDefaultSubsection(type)
              }
            ]
          };
        }

        return {
          payload: {
            id: nanoid(),
            type,
            columnIndex,
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
      // console.log("SECTION: ", section)

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