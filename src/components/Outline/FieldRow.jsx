import React from 'react';
import styles from './Outline.module.css';
import {
  reorderSections,
  deleteSection,
  addSubsection,
  deleteSubsection,
  reorderSubsections,
  addField,
  updateField,
  deleteField,
  reorderFields
} from "../../store/resumeSlice";

const FieldRow = ({ dispatch, field, fieldIndex, sectionId, subsectionId, handleFieldChange, isHeaderOrSummary, dragItem, setDragItem }) => {
   
   return (
      <div
        key={field.id}
        className={`${styles.fieldInputRow} ${styles.fieldRow}`}
        draggable={true}
        onDragStart={(e) => {
          e.stopPropagation();
          if (dragItem) return;
          setDragItem({
            type: "field",
            sectionId,
            subsectionId,
            index: fieldIndex
          });
          e.dataTransfer.effectAllowed = "move";
        }}
        onDragOver={(e) => {
          e.stopPropagation();
          if (!dragItem || dragItem.type !== "field") return;
          e.preventDefault();

          // Only reorder fields within the same section + same subsection (or same "no subsection" group)
          if (
            dragItem.sectionId !== sectionId ||
            dragItem.subsectionId !== subsectionId
          ) {
            return;
          }

          if (dragItem.index === fieldIndex) return;

          dispatch(
            reorderFields({
              sectionId,
              subsectionId: isHeaderOrSummary ? null : subsectionId,
              fromIndex: dragItem.index,
              toIndex: fieldIndex
            })
          );

          setDragItem((prev) => ({ ...prev, index: fieldIndex }));
        }}
        onDragEnd={(e) => {
          e.stopPropagation();
          setDragItem(null);
        }}
        onDrop={(e) => {
          e.stopPropagation();
          setDragItem(null);
        }}
      >
        <div className={styles.dragHandle}>⋮⋮</div>

        <input
          className={styles.subInput}
          value={field.value}
          placeholder={field.label}
          onChange={(e) =>
            handleFieldChange(sectionId, subsectionId, field.id, e.target.value)
          }
        />

        <button
          className={styles.deleteButton}
          onClick={() =>
            dispatch(
              deleteField({
                sectionId,
                subsectionId,
                fieldId: field.id
              })
            )
          }
        >
          ✕
        </button>
      </div>
   );
};

export default FieldRow;