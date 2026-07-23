import { createSlice } from '@reduxjs/toolkit';

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

const updateAutoColumnWidths = (state) => {
   let remainingColumnWidth = 100;
   let autoColumnsArr = [];
   for (let columnId of state.columns.allIds) {
      const column = state.columns.byId[columnId]
      if (column.layout.width.auto !== undefined) {
         console.log('CHECKING')

         if (column.layout.width.auto === true) {
            autoColumnsArr.push(columnId);
         } else {
            // } else if (column.autoWith === false) {
            const columnWidth = parseFloat(column.layout.width.value.replace('%', ''));
            remainingColumnWidth -= columnWidth;
         }
      }
   }
   const updatedAutoWidthValue = String(remainingColumnWidth / autoColumnsArr.length) + '%'
   for (let columnId of autoColumnsArr) {
      const column = state.columns.byId[columnId];
      column.layout.width.value = updatedAutoWidthValue;
   }
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
      allIds: [],
      totalWidth: 100
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
   activeSectionIds: [],
   activeSectionId: null,
   activeEditorId: null,
   activeEditorSelection: null,
   resumeRef: null,
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
      setResume(state, action) {
         console.log("Setting Resume: ", action.payload)
         return {
            ...initialState,
            ...action.payload,
            activeSectionId: null,
            activeEditorId: null,
            activeEditorSelection: null,
         };
      },
      setResumeId(state, action) {
         const id = action.payload;
         state.id = id;
      },

      setResumePrintRef(state, action) {
         state.ref = action.payload;
      },

      // * ------------ V
      // * ADD TO STATE V
      // * ------------ V

      // addColumn(state) {
      //   createDefaultColumn(state);
      // },

      // addSection(state, action) {
      //   const type = action.payload;
      //   const section = createDefaultSection(state, type);
      //   if (!section) {
      //     console.error(`Failed to create section of type ${type}.`);
      //     return;
      //   }
      //   const subsection = createDefaultSubsection(state, type, section.id);
      //   createDefaultField(state, type, subsection.id);
      //   // return section;
      // },

      // addSubsection(state, action) {
      //   const { sectionId } = action.payload;
      //   const section = state.sections.byId[sectionId];
      //   if (!section) {
      //     console.error(`Cannot add subsection.  No section with ID of ${sectionId} found.`);
      //     return;
      //   }
      //   const subsection = createDefaultSubsection(state, section.type, sectionId);
      //   createDefaultField(state, section.type, subsection.id);
      // },

      // addField(state, action) {
      //   const { subsectionId } = action.payload;
      //   const subsection = state.subsections.byId[subsectionId];
      //   if (!subsection) {
      //     console.error(`Cannot add field.  No subsection with ID of ${subsectionId} found.`);
      //     return;
      //   }
      //   createDefaultField(state, subsection.type, subsection.id);
      // },

      // * ----------------- V
      // * DELETE FROM STATE V
      // * ----------------- V

      deleteColumn(state, action) {
         const id = action.payload;
         deleteColumnById(state, id);
      },

      deleteSection(state, action) {
         const id = action.payload;
         deleteSectionById(state, id);
      },

      deleteSubsection(state, action) {
         const id = action.payload;
         deleteSubsectionById(state, id);
      },

      deleteField(state, action) {
         const id = action.payload;
         deleteFieldById(state, id);
      },

      // * ------------ V
      // * UPDATE STATE V
      // * ------------ V

      updateResume(state, action) {
         const { key, changes } = action.payload;

         if (key === "title") {
            state.title = changes;
            return;
         }

         state[key] = {
            ...state[key],
            ...changes,
         };
      },
      updateColumn(state, action) {
         const { id, changes } = action.payload;

         const column = state.columns.byId[id];

         if (!column) {
            console.error(`Column with ID ${id} not found.`);
            return;
         }

         if (changes.layout) {
            column.layout ??= {};

            if (changes.layout.width) {
               column.layout.width = {
                  ...column.layout.width,
                  ...changes.layout.width,
               };

               updateAutoColumnWidths(state);
            }

            if (changes.layout.padding) {
               column.layout.padding = {
                  ...column.layout.padding,
                  ...changes.layout.padding,
               };
            }
         }

         Object.assign(column, {
            ...changes,
            layout: column.layout,
         });
      },
      updateSection(state, action) {
         const { id, changes } = action.payload;

         const section = state.sections.byId[id];

         if (!section) {
            console.error(`Cannot update section. ID of ${id} not found.`);
            return;
         }

         if (changes.columnId && changes.columnId !== section.columnId) {
            const oldColumnId = section.columnId;
            const newColumnId = changes.columnId;

            const oldColumn = state.columns.byId[oldColumnId];
            const newColumn = state.columns.byId[newColumnId];

            if (oldColumn) {
               oldColumn.sectionIds = oldColumn.sectionIds.filter(
                  (id) => id !== id
               );
            }

            if (newColumn && !newColumn.sectionIds.includes(id)) {
               newColumn.sectionIds.push(id);
            }

            section.columnId = newColumnId;
         }

         if (changes.styling) {
            section.styling = {
               ...section.styling,
               ...changes.styling,
            };
         }

         if (changes.layout) {
            section.layout ??= {};

            section.layout = {
               ...section.layout,
               ...changes.layout,
               padding: {
                  ...section.layout.padding,
                  ...changes.layout.padding,
               },
            };
         }

         Object.assign(section, {
            ...changes,
            columnId: section.columnId,
            styling: section.styling,
            layout: section.layout,
         });
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

      updateSubsectionFlexDirection(state, action) {
         const { id, flexDirection } = action.payload;
         const subsection = state.subsections.byId[id];
         if (!subsection) {
            console.error(`Cannot update subsection. ID of ${id} not found.`);
            return;
         }
         subsection.layout.flexDirection = flexDirection;
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

      updateFieldLayout(state, action) {
         const { id, changes } = action.payload;
         const field = state.fields.byId[id];
         console.log('FIELD BEFORE CHANGES: ', field)
         console.log('FIELD LAYOUT CHANGES:', changes)
         if (!field) {
            console.error(`Cannot update field.  ID of ${id} not found.`);
            return;
         }
         if (!field.layout) {
            field.layout = {};
         }
         Object.assign(field.layout, changes);
         console.log('FIELD AFTER CHANGES: ', field.layout)
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

      setActiveSectionIds(state, action) {
         const id = action.payload;
         const currentActiveSectionIds = state.activeSectionIds;

         if (currentActiveSectionIds.includes(id)) {
            state.activeSectionIds = currentActiveSectionIds.filter(
               (activeId) => activeId != id
            );
         } else {
            state.activeSectionIds.push(id);
         }
      },

      clearActiveSectionIds(state, action) {
         state.activeSectionIds = [];
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
         const { fromId, toId } = action.payload;

         if (!fromId || !toId || fromId === toId) {
            return;
         }

         const sectionIdsArr = state.sections.allIds;
         const fromIndex = sectionIdsArr.indexOf(fromId);
         const toIndex = sectionIdsArr.indexOf(toId);
         const insertAfterTarget = fromIndex < toIndex;

         if (fromIndex === -1 || toIndex === -1) {
            console.error(`Cannot reorder sections. Invalid fromId (${fromId}) or toId (${toId}).`);
            return;
         }

         const fromSection = state.sections.byId[fromId];
         const toSection = state.sections.byId[toId];

         if (!fromSection || !toSection) {
            console.error('Cannot reorder sections. One or both sections were not found.');
            return;
         }

         const fromColumnId = fromSection.columnId;
         const toColumnId = toSection.columnId;

         const fromColumn = state.columns.byId[fromColumnId];
         const toColumn = state.columns.byId[toColumnId];

         if (!fromColumn || !toColumn) {
            console.error('Cannot reorder sections. One or both columns were not found.');
            return;
         }

         if (!fromColumn.sectionIds.includes(fromId) || !toColumn.sectionIds.includes(toId)) {
            console.error('Cannot reorder sections. One or both section IDs were not found in their columns.');
            return;
         }

         const fromColumnSectionIds = fromColumn.sectionIds.filter((id) => id !== fromId);
         const toColumnSectionIds = fromColumn === toColumn
            ? fromColumnSectionIds
            : [...toColumn.sectionIds];

         const globalFromIndex = sectionIdsArr.indexOf(fromId);
         if (globalFromIndex === -1) {
            console.error(`Cannot reorder sections. fromId ${fromId} not found in sections.allIds.`);
            return;
         }
         sectionIdsArr.splice(globalFromIndex, 1);

         const globalTargetIndex = sectionIdsArr.indexOf(toId);
         if (globalTargetIndex === -1) {
            console.error(`Cannot reorder sections. toId ${toId} not found in sections.allIds.`);
            return;
         }
         const globalInsertIndex = insertAfterTarget ? globalTargetIndex + 1 : globalTargetIndex;
         sectionIdsArr.splice(globalInsertIndex, 0, fromId);

         const targetColumnIndex = toColumnSectionIds.indexOf(toId);
         if (targetColumnIndex === -1) {
            console.error(`Cannot reorder sections. toId ${toId} not found in destination column.`);
            return;
         }

         const columnInsertIndex = insertAfterTarget ? targetColumnIndex + 1 : targetColumnIndex;
         toColumnSectionIds.splice(columnInsertIndex, 0, fromId);

         fromColumn.sectionIds = fromColumnSectionIds;

         if (fromColumn !== toColumn) {
            toColumn.sectionIds = toColumnSectionIds;
         } else {
            fromColumn.sectionIds = toColumnSectionIds;
         }

         if (fromColumn !== toColumn) {
            fromSection.columnId = toSection.columnId;
         }

         const affectedColumns = fromColumn === toColumn
            ? [fromColumn]
            : [fromColumn, toColumn];

         for (const column of affectedColumns) {
            column.sectionIds.forEach((id, index) => {
               const candidateSection = state.sections.byId[id];
               if (!candidateSection) return;

               // Positions should always mirror the final sectionIds order.
               candidateSection.position = index;
            });
         }
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
   setActiveSectionId,
   setActiveSectionIds,
   clearActiveSectionIds,
   setActiveEditorId,
   setActiveEditorSelection,

   setResumeId,
   setResume,
   updateResume,
   setResumePrintRef,

   // addColumn,
   deleteColumn,
   updateColumn,

   // addSection,
   updateSection,
   deleteSection,
   reorderSections,

   // addSubsection,
   updateSubsection,
   updateSubsectionFlexDirection,
   deleteSubsection,
   reorderSubsections,

   // addField,
   deleteField,
   updateFieldValue,
   updateFieldLayout,
   swapFieldPositions,
   reorderFields

} = resumeSlice.actions;

export default resumeSlice.reducer;
