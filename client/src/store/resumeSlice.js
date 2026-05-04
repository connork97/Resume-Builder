import { createSlice, nanoid } from '@reduxjs/toolkit';

const deleteColumnById = (state, columnId) => {
  const allColumnIds = state.columns.allIds;

  if (allColumnIds.length === 1) {
    alert('Cannot delete the only remaining column.');
    return;
  }

  const columnToDelete = state.columns.byId[columnId];

  if (!columnToDelete) {
    console.error(`Cannot delete column. Column with ID ${columnId} not found.`);
    return;
  }

  const lastAvailableColumnId = state.columns.allIds.findLast(
    (id) => id !== columnId
  );

  const lastAvailableColumn = state.columns.byId[lastAvailableColumnId];

  if (!lastAvailableColumn) {
    console.error('Cannot delete column. No destination column found.');
    return;
  }

  columnToDelete.sectionIds.forEach((sectionId) => {
    const sectionToMove = state.sections.byId[sectionId];

    if (!sectionToMove) return;

    lastAvailableColumn.sectionIds.push(sectionId);
    sectionToMove.columnId = lastAvailableColumnId;
  });

  columnToDelete.sectionIds = [];

  delete state.columns.byId[columnId];

  state.columns.allIds = state.columns.allIds.filter((id) => id !== columnId);
};

const deleteSectionById = (state, sectionId) => {
  const section = state.sections.byId[sectionId];
  const column = state.columns.byId[section.columnId];
  if (column) {
    column.sectionIds = column.sectionIds.filter((id) => id !== sectionId);
  }

  section.subsectionIds.forEach((subsectionId) => {
    deleteSubsectionById(state, subsectionId);
  });

  delete state.sections.byId[sectionId];
  state.sections.allIds = state.sections.allIds.filter((id) => id !== sectionId);
};

const deleteSubsectionById = (state, subsectionId) => {
  const subsection = state.subsections.byId[subsectionId];
  const section = state.sections.byId[subsection.sectionId];
  if (!section || !Array.isArray(section.subsectionIds)) {
    console.error(`Cannot delete subsection. Section with ID ${subsection.sectionId} not found or has invalid subsections array.`);
    return;
  }

  // Remove subsection from section's subsectionIds array
  section.subsectionIds = section.subsectionIds.filter((id) => id !== subsectionId);

  // Delete all fields in the subsection
  subsection.fieldIds.forEach((fieldId) => {
    delete state.fields.byId[fieldId];
    state.fields.allIds = state.fields.allIds.filter(id => id !== fieldId);
  });

  // Delete the subsection itself
  delete state.subsections.byId[subsectionId];
  state.subsections.allIds = state.subsections.allIds.filter(id => id !== subsectionId);
};

const deleteFieldById = (state, fieldId) => {
  const field = state.fields.byId[fieldId];
  const subsection = state.subsections.byId[field.subsectionId];
  subsection.fieldIds = subsection.fieldIds.filter((id) => id !== field.id);

  delete state.fields.byId[field.id];
  state.fields.allIds = state.fields.allIds.filter(id => id !== field.id);
};


// * ------------- V
// * INITIAL STATE V
// * ------------- V

const initialState = {
  id: null,
  title: '',
  userId: null,

  columns: {
    byId: {},
    allIds: []
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
  name: 'resume',
  initialState,
  reducers: {
    loadResume(state, action) {
      return {
        ...initialState,
        ...action.payload,
        activeSectionId: null,
        activeEditorId: null,
        activeEditorSelection: null,
      };
    },
    setResume: (state, action) => {
      console.log("Setting Resume: ", action.payload)
      return {
        ...initialState,
        ...action.payload,
        activeSectionId: null,
        activeEditorId: null,
        activeEditorSelection: null,
      };
    },
    setResumeId: (state, action) => {
      const id = action.payload;
      state.id = id;
    },


    // * ------------ V
    // * ADD TO STATE V
    // * ------------ V

    addColumn(state) {
      createDefaultColumn(state);
    },

    addSection(state, action) {
      const type = action.payload;
      const section = createDefaultSection(state, type);
      if (!section) {
        console.error(`Failed to create section of type ${type}.`);
        return;
      }
      const subsection = createDefaultSubsection(state, type, section.id);
      createDefaultField(state, type, subsection.id);
      // return section;
    },

    addSubsection(state, action) {
      const { sectionId } = action.payload;
      const section = state.sections.byId[sectionId];
      if (!section) {
        console.error(`Cannot add subsection.  No section with ID of ${sectionId} found.`);
        return;
      }
      const subsection = createDefaultSubsection(state, section.type, sectionId);
      createDefaultField(state, section.type, subsection.id);
    },

    addField(state, action) {
      const { subsectionId } = action.payload;
      const subsection = state.subsections.byId[subsectionId];
      if (!subsection) {
        console.error(`Cannot add field.  No subsection with ID of ${subsectionId} found.`);
        return;
      }
      createDefaultField(state, subsection.type, subsection.id);
    },

    // * ----------------- V
    // * DELETE FROM STATE V
    // * ----------------- V

    deleteColumn(state, action) {
      const id = action.payload;
      deleteColumnById(state, id);
      // const column = state.columns.byId[columnId];
      // if (!column) {
      //   console.error(`Cannot delete column.  No column with ID of ${columnId} found.`);
      //   return;
      // }

      // // Move sections in deleted column to last available column
      // column.sectionIds.forEach((sectionId) => {
      //   const section = state.sections.byId[sectionId];
      //   section.columnId = state.columns.allIds.findLast((id) => id !== columnId);
      // });

      // delete state.columns.byId[columnId];
      // state.columns.allIds = state.columns.allIds.filter((id) => id !== columnId);
    },

    deleteSection(state, action) {
      const id = action.payload;
      deleteSectionById(state, id);

      // const section = state.sections.find(s => s.id === sectionId);
      // if (!section) return;
      // const column = state.columns.byId[section.columnId];
      // column.sectionIds.filter((id) => id !== sectionId);

      // const subsectionIds = section.subsectionIds;

      // for (const id in subsectionIds) {
      //   const subsection = state.subsections.byId[id];

      // }


      // state.sections = state.sections.filter((s) => s.id !== sectionId);
    },

    deleteSubsection(state, action) {
      const id = action.payload;
      deleteSubsectionById(state, id);

      // const section = state.sections.find((s) => s.id === sectionId);
      // const subsection = section.subsections.find((s) => s.id === subsectionId);

      // if (!section || !Array.isArray(section.subsections) || !subsection) return;

      // subsection.fieldIds.forEach((fieldId) => {
      //   delete state.fields.byId[fieldId];
      //   state.fields.allIds = state.fields.allIds.filter((id) => id !== fieldId);
      // })

      // section.subsections = section.subsections.filter(
      //   (sub) => sub.id !== subsectionId
      // );
    },

    deleteField(state, action) {
      const id = action.payload;

      // const field = state.fields.byId[fieldId];
      deleteFieldById(state, id);

      // const subsection = state.subsections.byId[field.subsectionId]
      // delete state.fields.byId[fieldId];
      // state.fields.allIds = state.fields.allIds.filter(id => id !== fieldId);

      // const section = state.sections.find((s) => s.id === sectionId);
      // if (!section) return;

      // const subsection = state.subsections.byId[subsectionId];
      // const subsection = section.subsections.find((s) => s.id === subsectionId);
      // if (!subsection) return;

      // subsection.fieldIds = subsection.fieldIds.filter(id => id !== fieldId);
      // subsection.fields = subsection.fields.filter((f) => f.id !== fieldId);
    },

    // * ------------ V
    // * UPDATE STATE V
    // * ------------ V

    updateColumn(state, action) {
      const { id, changes } = action.payload;
      console.log("Updating column with ID:", id, "Changes:", changes);
      const column = state.columns.byId[id];
      if (!column) {
        console.error(`Column with ID ${id} not found.`);
        return;
      }
      if (column) {
        Object.assign(column, changes);
      }
    },

    updateSection(state, action) {
      const { sectionId, changes } = action.payload;
      const section = state.sections.byId[sectionId];
      console.log('SECTION FROM SLICE', action.payload)
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

      for (const key in changes) {
        if (key === "position") {
          subsection.position = changes.position;

          section.subsectionIds = section.subsectionIds
            .map(id => state.subsections.byId[id])
            .filter(Boolean)
            .sort((a, b) => a.position - b.position)
            .map(subsection => subsection.id);
        } else {
          subsection[key] = changes[key];
        }
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

    updateFieldValue(state, action) {
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

    swapFieldPositions(state, action) {
      const { fieldId, targetFieldId } = action.payload;

      const field = state.fields.byId[fieldId];
      const targetField = state.fields.byId[targetFieldId];

      if (!field || !targetField) {
        console.error("Swap failed: field not found.");
        return;
      }

      const subsection = state.subsections.byId[field.subsectionId];

      if (!subsection) {
        console.error("Swap failed: subsection not found.");
        return;
      }

      // Swap positions
      const originalPosition = field.position;
      field.position = targetField.position;
      targetField.position = originalPosition;

      // Re-sort fieldIds to reflect new order
      subsection.fieldIds = subsection.fieldIds
        .map(id => state.fields.byId[id])
        .filter(Boolean)
        .sort((a, b) => a.position - b.position)
        .map(f => f.id);
    },

    updateResumeStyling(state, action) {
      state.styling = { ...state.styling, ...action.payload };
    },

    updateResumeTitle(state, action) {
      console.log('current title', state.title, 'action payload', action.payload);
      state.title = action.payload;
    },

    updateResume(state, action) {
      const { key, changes } = action.payload;
      state.layout = { ...state[key], ...changes };
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

    // * ---------- V
    // * REORDERING V
    // * ---------- V

    reorderSections(state, action) {
      const { sectionId, fromIndex, toIndex } = action.payload;

      const section = state.sections.byId[sectionId];
      if (!section) {
        console.error(`Cannot reorder sections. Section with ID of ${sectionId} not found.`);
        return;
      }

      const column = state.columns.byId[section.columnId];
      if (!column) {
        console.error(`Cannot reorder sections. Column with ID of ${section.columnId} not found.`);
        return;
      }
      const [moved] = state.sections.splice(fromIndex, 1);
      state.sections.splice(toIndex, 0, moved);
    },

    reorderSubsections(state, action) {
      const { sectionId, fromIndex, toIndex } = action.payload;
      const section = state.sections.byId[sectionId];

      if (!section) {
        console.error(`Cannot reorder subsections. Section with ID of ${sectionId} not found.`);
        return;
      }

      const subsectionIdsArr = section.subsectionIds;
      const [moved] = subsectionIdsArr.splice(fromIndex, 1);
      subsectionIdsArr.splice(toIndex, 0, moved);
    },

    //  Reorder fields in a subsection
    reorderFields(state, action) {
      const { subsectionId, fromIndex, toIndex } = action.payload;

      const subsection = state.subsections.byId[subsectionId];
      if (!subsection) {
        console.error(`Cannot reorder fields. Subsection with ID of ${subsectionId} not found.`);
        return;
      }

      const fieldIdsArr = subsection.fieldIds;
      const [moved] = fieldIdsArr.splice(fromIndex, 1);
      fieldIdsArr.splice(toIndex, 0, moved);
    },
  },
});

export const {

  setResumeId,
  setResume,

  setActiveSectionId,
  setActiveEditorId,
  setActiveEditorSelection,
  updateResume,
  updateResumeTitle,
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
  updateFieldValue,
  swapFieldPositions,
  deleteField,
  reorderFields
} = resumeSlice.actions;

export default resumeSlice.reducer;