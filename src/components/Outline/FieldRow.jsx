import React from 'react';

import { useDispatch } from 'react-redux';
import { Node } from 'slate';

import { deleteField, reorderFields } from "../../store/resumeSlice";

import styles from './Outline.module.css';

const FieldRow = ({ field, fieldIndex, sectionId, subsectionId, isHeaderOrSummary, dragItem, setDragItem }) => {

  const dispatch = useDispatch();
  const fieldValueText = Node.string(field.value[0]);
  const placeholderFieldText = field.label;

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
      <p className={
        fieldValueText.length ? styles.subFieldText : styles.placeholderFieldText
      }>
        {fieldValueText.length ? fieldValueText : placeholderFieldText}
      </p>
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