import React from 'react';
import styles from './Outline.module.css';

import { Node } from 'slate';

import SlateField from '../Slate/SlateField.jsx';

import {
  deleteField,
  reorderFields
} from "../../store/resumeSlice";

const FieldRow = ({ dispatch, field, fieldIndex, sectionId, subsectionId, handleFieldChange, isHeaderOrSummary, dragItem, setDragItem }) => {
  //  console.log(field.value[0].children)
  // console.log("FIELD", field.value[0].children[0].text)
  console.log("FIELD:", field.value[0].children[0].text)

  // const fieldValueText = field.value[0].children[0].text;
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
      {/* <SlateField
        key={field.id}
        field={field}
        sectionId={field.id}
        subsectionId={subsectionId} */}
                  {/* // onChange={(e) => */}
            {/* // handleFieldChange(sectionId, subsectionId, field.id, e.target.value) */}
          {/* // } */}
      {/* // /> */}
      {/* <input
          className={styles.subInput}
          value={field.value.children}
          placeholder={field.label}
          onChange={(e) => {
            console.log(field.value)
            handleFieldChange(sectionId, subsectionId, field.id, e.target.value)
          }
          }
        /> */}
        <p className={fieldValueText.length ? styles.subFieldText : styles.placeholderFieldText}>{fieldValueText.length? fieldValueText : placeholderFieldText}</p>

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