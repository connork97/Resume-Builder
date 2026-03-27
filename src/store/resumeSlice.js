import { autoBatchEnhancer, createSlice, nanoid } from "@reduxjs/toolkit";
import { current } from "immer";


const createDefaultColumn = (width = null) => {
  const column = {
    id: nanoid(),
    width: width,
    sectionIds: [],
  }

  return column;
};

// Default Data for Brand New Section
const createDefaultSection = (type = 'defaultSection', columnId = null) => {
  console.log('Creating section of type: ', type)
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
  console.log('Creating subsection of type: ', type)
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
  columns: {
    byId: {
      [firstColumnId]: {
        id: firstColumnId,
        width: null,
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
    padding: {
      top: '2.5rem',
      right: '2.5rem',
      bottom: '2.5rem',
      left: '2.5rem'
    },
    gap: {
      horizontal: '1rem',
      vertical: '0.5rem'
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
        console.log('Adding Section: ', section)
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
      if (!section) {
        console.error(`Cannot add subsection.  No section with ID of ${sectionId} found.`);
        return;
      }

      const type = section.type;

      // Create New Subsection
      const subsectionData = createDefaultSubsection(type, sectionId);
      const subsection = subsectionData.subsection;
      console.log('Adding subsection: ', subsection)
      // Add Subsection to State
      state.subsections.byId[subsection.id] = subsection;
      state.subsections.allIds.push(subsection.id);
      state.sections.byId[sectionId].subsectionIds.push(subsection.id);

      // Add Fields to State
      
      const fields = subsectionData.fields;
      fields.forEach((field) => {
        state.fields.byId[field.id] = field;
        state.fields.allIds.push(field.id);
      });

    },

    addField(state, action) {
      const { subsectionId, fieldData } = action.payload;

      // Find the subsection to which the field will be added
      const subsection = state.subsections.byId[subsectionId];
      if (!subsection) {
        console.error(`Cannot add field.  No subsection with ID of ${subsectionId} found.`);
        return;
      }

      // Create Field and Add to State
      const newField = createDefaultField([fieldData?.label], subsectionId);
      state.fields.byId[newField.id] = newField;
      state.fields.allIds.push(newField.id);

      //  Establish Subsection/Field Relationship
      subsection.fieldIds.push(newField.id);
    },

    addColumn(state) {
      //  Create New Column and Add to State
      const newColumn = createDefaultColumn();
      state.columns.byId[newColumn.id] = newColumn;
      state.columns.allIds.push(newColumn.id);
    },

    deleteColumn(state, action) {
      const { columnId } = action.payload;
      const column = state.columns.byId[columnId];
      if (!column) {
        console.error(`Cannot delete column.  No column with ID of ${columnId} found.`);
        return;
      }

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
      const columnId = section.columnId;

      if (!section) {
        console.error(`Cannot update section. ID of ${sectionId} not found.`);
        return;
      }

      for (const key in changes) {
        if (key === "styling") {
          section.styling = { ...section.styling, ...changes.styling };
        }
        // When updating section's columnId, also update the old AND new Columns' sectionIds
        else if (key === 'columnId') {
          const oldColumn = state.columns.byId[columnId];
          const newColumnId = changes.columnId;

          // Remove Section ID from Old Column's sectionIds Array
          if (oldColumn) {
            oldColumn.sectionIds = oldColumn.sectionIds.filter((id) => id !== sectionId);
          }

          // Add Section ID to New Column's sectionIds Array
          const newColumn = state.columns.byId[newColumnId];
          if (newColumn) {
            newColumn.sectionIds.push(sectionId);
          }
          section[key] = changes[key];
        } else {
          section[key] = changes[key];
        }
      }
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
      console.log("Updating column with ID:", id, "Changes:", changes);
      const column = state.columns.byId[id];
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