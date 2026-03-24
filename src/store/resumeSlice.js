import { autoBatchEnhancer, createSlice, nanoid } from "@reduxjs/toolkit";


const createDefaultColumn = (width = '100%') => {
  const column = {
    id: nanoid(),
    width: width,
    sectionIds: [],
  }

  return column;
};

// Default Data for Brand New Section
const createDefaultSection = (type = 'defaultSection', columnId = null) => {

  const sectionHeadingDict = {
    header: "Header",
    contact: "Contact",
    skills: "Skills",
    workHistory: "Work History",
    education: "Education",
    summary: "Summary",
    defaultSection: "Default Section"
  };

  const sectionId = nanoid();
  // const subsection = createDefaultSubsection(type, sectionId);

  const section = {
    id: sectionId,
    columnId: columnId,
    subsectionIds: [],
    label: sectionHeadingDict[type],
    type: type,
    // layout: {
    //   columnIndex: columnIndex,
    // },
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
    styling: {},
  };

  return section;
};

// Default Subsection Fields (for Initial AND Additional Subsections)
const createDefaultSubsection = (type = 'defaultSubsection', sectionId) => {

  const defaultTypesDict = {
    header: ["Name", "Title"],
    workHistory: ["Job Title", "Company", "Location", "Start/End Dates", "Description"],
    education: ["School", "Degree", "Field of Study", "Location", "Start/End Dates", "Description"],
    skills: ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
    contact: ["Email", "Phone", "Location", "Website", "LinkedIn"],
    summary: ["Summary"],
    defaultSubsection: ["Field"]
  };

  const subsectionId = nanoid();
  const fields = createDefaultField(defaultTypesDict[type], subsectionId);

  const subsection = {
    id: subsectionId,
    sectionId: sectionId,
    fieldIds: fields.map((field) => field.id),
    label: type,
    styling: {},
  }

  return { subsection, fields };
};

// Helper function to create standardized fields regardless of section type
const createDefaultField = (arrToMap = ["Field"], subsectionId) => {

  return (
    arrToMap.map((field) => ({
      id: nanoid(),
      subsectionId: subsectionId,
      label: field,
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
      styling: {},
    }))
  )
};

// Resume Slice
const firstColumnId = nanoid();
const initialState = {
  // sections: [],
  columns: {
    byId: {
      [firstColumnId]: {
         id: firstColumnId,
         width: '100%',
         sectionIds: []
      },
    },
    allIds: [firstColumnId]
  },
  sections: {
    byId: {},
    allIds: []
  },
  subsections: {
    byId: {},
    allIds: []
  },
  fields: {
    byId: {},
    allIds: []
  },
  styling: {
    display: 'flex',
    fontSize: '12px',
    lineHeight: 1.2,
    color: 'rgba(0, 0, 0, 1)',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },

  layout: {
    // columns: [
    // createDefaultColumn('100%')
    // children: [sections => sections.filter((section) => section.columnIndex === 0).map(section => section.id)],
    // ],
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
  activeSectionId: null,
  activeEditorId: null,
  activeEditorSelection: null
};

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    addSection: {
      reducer(state, action) {
        const section = action.payload;
        // Establish Section/Column Relationship
        if (!section.columnId) {
          const firstColumnId = state.columns.allIds[0];
          section.columnId = firstColumnId;
          state.columns.byId[firstColumnId].sectionIds.push(section.id);
        }
        // Add Section to State
        if (!state.sections.byId[section.id]) {
          state.sections.byId[section.id] = section;
          state.sections.allIds.push(section.id);
        }
        if (!section.subsectionIds) {
          section.subsectionIds = [];
        }

        // Create First Subsection for the Section
        const subsectionData = createDefaultSubsection(section.type, section.id);
        const subsection = subsectionData.subsection;

        // Establish Section/Subsection Relationship
        section.subsectionIds.push(subsection.id);

        // Add Subsection to State
        state.subsections.byId[subsection.id] = subsection;
        state.subsections.allIds.push(subsection.id);

        // Add Fields to State
        // Subsection/Fields Relationship is Already Established in createDefaultSubsection Function
        const subsectionFields = subsectionData.fields;
        subsectionFields.forEach((field) => {
          state.fields.byId[field.id] = field;
          state.fields.allIds.push(field.id);
        });
      },
      prepare(type) {
        return {
          payload: createDefaultSection(type)
        };
      }
    },

    addSubsection(state, action) {
      const { sectionId } = action.payload;

      const section = state.sections.byId[sectionId];
      if (!section) return;

      const type = section.type;

      // Create New Subsection
      const subsection = createDefaultSubsection(type, sectionId);

      // Add Subsection to State
      state.subsections.byId[subsection.id] = subsection;
      state.subsections.allIds.push(subsection.id);

    },

    addField(state, action) {
      const { subsectionId, fieldData } = action.payload;

      // Find the subsection to which the field will be added
      const subsection = state.subsections.byId[subsectionId];
      if (!subsection) return;

      // Create Field and Add to State
      const newField = createDefaultField([fieldData?.label], subsectionId);
      state.fields.byId[newField.id] = newField;
      state.fields.allIds.push(newField.id);

      //  Establish Subsection/Field Relationship
      subsection.fieldIds.push(newField.id);
    },

    addColumn(state, action) {
      const columnsLength = state.columns.allIds.length;
      const width = columnsLength === 0 ? '100%' : `${100 / (columnsLength + 1)}%`;
      const newColumn = createDefaultColumn(width);
      state.columns.byId[newColumn.id] = newColumn;
      state.columns.allIds.push(newColumn.id);

      // state.columns.allIds.map((id) => {
      //   state.columns.byId[id].width = width;
      // })
    },

    deleteColumn(state, action) {
      const { columnId } = action.payload;
      const column = state.columns.byId[columnId];
      if (!column) return;

      // Move sections in deleted column to last available column
      column.sectionIds.forEach((sectionId) => {
        const section = state.sections.byId[sectionId];
        section.columnId = state.columns.allIds.findLast((id) => id !== columnId);
      });

      delete state.columns.byId[columnId];
      state.columns.allIds = state.columns.allIds.filter((id) => id !== columnId);
    },

    updateSection(state, action) {
      const { sectionId, changes } = action.payload;
      const section = state.sections.byId[sectionId];
      if (!section) {
        console.error(`Cannot update section. ID of ${sectionId} not found.`);
        return;
      }
      console.log('SECTION CHANGES: ', changes);
      // if (section) {
      //   for (const key in changes) {
      //     if (key === "styling") {
      //       section.styling = { ...section.styling, ...changes.styling };
      //     } else if (key === "layout") {
      //       section.layout = { ...section.layout, ...changes.layout };
      //       section.subsections.forEach(sub => {
      //         sub.layout = { ...sub.layout, ...changes.layout };
      //       });
      //     } else {
      //       section[key] = changes[key];
      //     }
      //   }

        // Object.assign(section, changes);
        // section.value = newValue};
    },

    updateSubsection(state, action) {
      const { subsectionId, changes } = action.payload;
      const subsection = state.subsections.byId[subsectionId];
      if (!subsection) {
        console.error(`Cannot update subsection. ID of ${subsectionId} not found.`);
        return;
      }
      const section = state.sections.byId[subsection.sectionId];
      if (!section) {
        console.error(`Cannot update subsection. Section with ID ${subsection.sectionId} not found.`);
        return;
      }

      // for (const key in changes) {
      //   if (key === "styling") {
      //     subsection.styling = { ...subsection.styling, ...changes.styling };
      //     normalizedSubsection.styling = { ...normalizedSubsection.styling, ...changes.styling };
      //   } else {
      //     subsection[key] = changes[key];
      //     normalizedSubsection[key] = changes[key];
      //   }
      // }
    },

    updateField(state, action) {
      const { fieldId, newValue } = action.payload;
      const field = state.fields.byId[fieldId];
      if (!field) {
        console.error(`Cannot update field. ID of ${fieldId} not found.`);
        return;
      }
      const subsection = state.subsections.byId[field.subsectionId];
      if (!subsection) {
        console.error(`Cannot update field. Subsection with ID ${field.subsectionId} not found.`);
        return;
      }
      field.value = newValue;
    },

    deleteSubsection(state, action) {
      const { sectionId, subsectionId } = action.payload;
      const section = state.sections.find((s) => s.id === sectionId);
      const subsection = section.subsections.find((s) => s.id === subsectionId);

      if (!section || !Array.isArray(section.subsections) || !subsection) return;

      subsection.fieldIds.forEach((fieldId) => {
        delete state.fields.byId[fieldId];
        state.fields.allIds = state.fields.allIds.filter((id) => id !== fieldId);
      })

      section.subsections = section.subsections.filter(
        (sub) => sub.id !== subsectionId
      );
    },

    //  Delete a field in a subsection
    deleteField(state, action) {
      const { fieldId, subsectionId, sectionId } = action.payload;
      delete state.fields.byId[fieldId];
      state.fields.allIds = state.fields.allIds.filter(id => id !== fieldId);

      const section = state.sections.find((s) => s.id === sectionId);
      if (!section) return;

      const subsection = section.subsections.find((s) => s.id === subsectionId);
      if (!subsection) return;

      subsection.fieldIds = subsection.fieldIds.filter(id => id !== fieldId);
      subsection.fields = subsection.fields.filter((f) => f.id !== fieldId);
      // const { sectionId, subsectionId, fieldId } = action.payload;
    },

    //  Reorder fields in a subsection
    reorderFields(state, action) {
      const { sectionId, subsectionId, fromIndex, toIndex } = action.payload;

      const section = state.sections.find((s) => s.id === sectionId);
      if (!section) return;

      const subsection = section.subsections.find((s) => s.id === subsectionId);
      if (!subsection) return;

      const arr = subsection.fieldIds;
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
    },

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

    updateColumn(state, action) {
      const { id, changes } = action.payload;
      const column = state.layout.columns.find((col) => col.id === id);
      if (column) {
        Object.assign(column, changes);
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

    // Reorder Subsections within a Section via Indexes
    reorderSubsections(state, action) {
      const { sectionId, fromIndex, toIndex } = action.payload;
      const section = state.sections.find(s => s.id === sectionId);

      if (!section) return;

      const arr = section.subsections;
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
    },
  },
});

export const {
  setActiveSectionId,
  setActiveEditorId,
  setActiveEditorSelection,
  updateResume,
  updateResumeStyling,
  addColumn,
  deleteColumn,
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











































































































// import { autoBatchEnhancer, createSlice, nanoid } from "@reduxjs/toolkit";


// const createDefaultColumn = (width = '100%') => {
//   return {
//     id: nanoid(),
//     width: width,
//     // sections: []
//     // children: []
//   }
// };

// // Default Data for Brand New Section
// const createDefaultSection = (type = 'defaultSection', columnIndex = 0) => {

//   const sectionHeadingDict = {
//     header: "Header",
//     contact: "Contact",
//     skills: "Skills",
//     workHistory: "Work History",
//     education: "Education",
//     summary: "Summary",
//     defaultSection: "Default Section"
//   };

//   const defaultSectionObj = {
//     id: nanoid(),
//     label: sectionHeadingDict[type],
//     type: type,
//     styling: {
//     },
//     layout: {
//       columnIndex: columnIndex,
//     },
//     value: [
//       {
//         type: "heading",
//         children: [
//           {
//             text: sectionHeadingDict[type],
//           }
//         ]
//       }
//     ],
//     subsections: [createDefaultSubsection(type)]
//   };

//   return defaultSectionObj;
// };

// // Helper function to create standardized fields regardless of section type
// const createDefaultField = (arrToMap = ["Field"]) => {

//   return (
//     arrToMap.map((field) => ({
//       id: nanoid(),
//       label: field,
//       styling: {},
//       value: [
//         {
//           type: "paragraph",
//           label: field,
//           children: [
//             {
//               text: "",
//             }
//           ]
//         }
//       ],
//     }))
//   )
// };

// // Default Subsection Fields (for Initial AND Additional Subsections)
// const createDefaultSubsection = (type = 'defaultSubsection', sectionLayout) => {

//   const defaultTypesDict = {
//     header: ["Name", "Title"],
//     workHistory: ["Job Title", "Company", "Location", "Start/End Dates", "Description"],
//     education: ["School", "Degree", "Field of Study", "Location", "Start/End Dates", "Description"],
//     skills: ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
//     contact: ["Email", "Phone", "Location", "Website", "LinkedIn"],
//     summary: ["Summary"],
//     defaultSubsection: ["Field"]
//   };

//   const fields = createDefaultField(defaultTypesDict[type]);

//   const defaultSubsectionObj = {
//     id: nanoid(),
//     label: type,
//     styling: {},
//     fields,
//     layout: {
//       ...sectionLayout,
//       children: fields.map((field) => ({
//         id: nanoid(),
//         type: 'field',
//         fieldId: field.id
//       }))
//     }
//   }

//   return defaultSubsectionObj;
// };

// // Resume Slice

// const initialState = {
//   styling: {
//     display: 'flex',
//     fontSize: '12px',
//     lineHeight: 1.2,
//     color: 'rgba(0, 0, 0, 1)',
//     backgroundColor: 'rgba(255, 255, 255, 1)',
//   },
//   layout: {
//     columns: [
//       createDefaultColumn('100%')
//       // children: [sections => sections.filter((section) => section.columnIndex === 0).map(section => section.id)],
//     ],
//     margin: {
//       top: 'auto',
//       right: 'auto',
//       bottom: 'auto',
//       left: 'auto'
//     },
//     padding: {
//       top: '3rem',
//       right: '3rem',
//       bottom: '3rem',
//       left: '3rem'
//     }
//   },
//   sections: [],
//   activeSectionId: null,
//   activeEditorId: null,
//   activeEditorSelection: null
// };

// const resumeSlice = createSlice({
//   name: "resume",
//   initialState,
//   reducers: {
//     setActiveSectionId(state, action) {
//       state.activeSectionId = action.payload;
//     },

//     setActiveEditorId(state, action) {
//       state.activeEditorId = action.payload;
//     },

//     // For Slate Purposes, sets the currently selected Slate Editor due to there being many different editors on the page at once.
//     setActiveEditorSelection(state, action) {
//       state.activeEditorSelection = action.payload;
//     },

//     updateResumeStyling(state, action) {
//       state.styling = { ...state.styling, ...action.payload };
//       // return action.payload;
//     },

//     updateResume(state, action) {
//       const { key, changes } = action.payload;
//       state.layout = { ...state[key], ...changes };
//     },

//     addColumn(state, action) {
//       // const { width } = action.payload;
//       const width = state.layout.columns.length === 0 ? '100%' : `${100 / (state.layout.columns.length + 1)}%`;
//       state.layout.columns.push(createDefaultColumn(width));
//       state.layout.columns.map((column) => {
//         column.width = width;
//       })
//     },

//     updateColumn(state, action) {
//       const { id, changes } = action.payload;
//       const column = state.layout.columns.find((col) => col.id === id);
//       if (column) {
//         Object.assign(column, changes);
//       }
//     },
//     addSection: {
//       reducer(state, action) {
//         state.sections.push(action.payload);
//       },
//       prepare(type) {
//         return {
//           payload: createDefaultSection(type)
//         };
//       }
//     },

//     updateSection(state, action) {
//       const { sectionId, changes } = action.payload;
//       console.log("Updating section", sectionId, changes);
//       const section = state.sections.find(s => s.id === sectionId);
//       console.log("Found section", section);
//       if (section) {
//         for (const key in changes) {
//           if (key === "styling") {
//             section.styling = { ...section.styling, ...changes.styling };
//           } else if (key === "layout") {
//             section.layout = { ...section.layout, ...changes.layout };
//             section.subsections.forEach(sub => {
//               sub.layout = { ...sub.layout, ...changes.layout };
//             });
//           } else {
//             section[key] = changes[key];
//           }
//         }
//         // Object.assign(section, changes);
//         // section.value = newValue};
//       }
//     },

//     deleteSection(state, action) {
//       const sectionId = action.payload;
//       const section = state.sections.find(s => s.id === sectionId);
//       if (!section) return;

//       state.sections = state.sections.filter((s) => s.id !== sectionId);
//     },

//     reorderSections(state, action) {
//       const { fromIndex, toIndex } = action.payload;
//       const [moved] = state.sections.splice(fromIndex, 1);
//       state.sections.splice(toIndex, 0, moved);
//     },

//     addSubsection(state, action) {
//       const { sectionId } = action.payload;
//       const section = state.sections.find(s => s.id === sectionId);

//       if (!section) return;

//       const type = section.type;

//       if (!Array.isArray(section.subsections)) {
//         section.subsections = [];
//       }

//       section.subsections.push({
//         ...createDefaultSubsection(type)
//       });
//     },

//     updateSubsection(state, action) {
//       const { sectionId, subsectionId, changes } = action.payload;
//       const section = state.sections.find(s => s.id === sectionId);
//       if (!section) return;

//       const subsection = section.subsections.find((s) => s.id === subsectionId);
//       if (!subsection) return;

//       for (const key in changes) {
//         if (key === "styling") {
//           subsection.styling = { ...subsection.styling, ...changes.styling };
//         } else {
//           subsection[key] = changes[key];
//         }
//       }
//     },

//     deleteSubsection(state, action) {
//       const { sectionId, subsectionId } = action.payload;
//       const section = state.sections.find(s => s.id === sectionId);

//       if (!section || !Array.isArray(section.subsections)) return;

//       section.subsections = section.subsections.filter(
//         (sub) => sub.id !== subsectionId
//       );
//     },

//     // Reorder Subsections within a Section via Indexes
//     reorderSubsections(state, action) {
//       const { sectionId, fromIndex, toIndex } = action.payload;
//       const section = state.sections.find(s => s.id === sectionId);

//       if (!section) return;

//       const arr = section.subsections;
//       const [moved] = arr.splice(fromIndex, 1);
//       arr.splice(toIndex, 0, moved);
//     },

//     //  Add field to a subsection
//     addField(state, action) {
//       const { sectionId, subsectionId, fieldData } = action.payload;

//       const section = state.sections.find(s => s.id === sectionId);
//       if (!section) return;

//       const subsection = section.subsections.find((s) => s.id === subsectionId);
//       if (!subsection) return;

//       subsection.fields.push({
//         id: nanoid(),
//         label: fieldData?.label ?? "New Field",
//         styling: fieldData?.styling ?? {},
//         value: fieldData?.value ?? [
//           {
//             type: "paragraph",
//             label: fieldData?.label ?? "New Field",
//             children: [
//               {
//                 text: "",
//                 fontSize: initialState.styling.fontSize,
//                 lineHeight: initialState.styling.lineHeight
//               }
//             ]
//           }
//         ],
//       });
//     },

//     //  Update a field in a subsection
//     updateField(state, action) {
//       const { sectionId, subsectionId, fieldId, newValue } = action.payload;
//       const section = state.sections.find((s) => s.id === sectionId);
//       if (!section) return;

//       const subsection = section.subsections.find((s) => s.id === subsectionId);
//       if (!subsection) return;

//       const field = subsection.fields.find((f) => f.id === fieldId);
//       if (field) field.value = newValue;
//     },

//     //  Delete a field in a subsection
//     deleteField(state, action) {
//       const { sectionId, subsectionId, fieldId } = action.payload;
//       const section = state.sections.find((s) => s.id === sectionId);
//       if (!section) return;

//       const subsection = section.subsections.find((s) => s.id === subsectionId);
//       if (!subsection) return;

//       subsection.fields = subsection.fields.filter((f) => f.id !== fieldId);
//     },

//     //  Reorder fields in a subsection
//     reorderFields(state, action) {
//       const { sectionId, subsectionId, fromIndex, toIndex } = action.payload;
//       const section = state.sections.find((s) => s.id === sectionId);
//       if (!section) return;

//       const subsection = section.subsections.find((s) => s.id === subsectionId);
//       if (!subsection) return;

//       const arr = subsection.fields;
//       const [moved] = arr.splice(fromIndex, 1);
//       arr.splice(toIndex, 0, moved);
//     }
//   }
// });

// export const {
//   setActiveSectionId,
//   setActiveEditorId,
//   setActiveEditorSelection,
//   updateResume,
//   updateResumeStyling,
//   addColumn,
//   updateColumn,
//   addSection,
//   updateSection,
//   deleteSection,
//   reorderSections,
//   addSubsection,
//   updateSubsection,
//   deleteSubsection,
//   reorderSubsections,
//   addField,
//   updateField,
//   deleteField,
//   reorderFields
// } = resumeSlice.actions;

// export default resumeSlice.reducer;