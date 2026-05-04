import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Node } from 'slate';

import { deleteField, reorderFields, setResume, updateSubsection, swapFieldPositions } from "@/store/resumeSlice";

import styles from '../Outline.module.css';
import { BASE_URL } from '@/config';
import normalizeResumeFromApi from '@/utils/normalizeResumeFromApi';
import { deleteFieldFromApi } from '@/services/resumeServices';

const FieldRow = ({ fieldId, fieldIndex, sectionId, subsectionId, isHeaderOrSummary, dragItem, setDragItem }) => {

  const dispatch = useDispatch();

  const fields = useSelector(state => state.resume.fields);
  const field = fields.byId[fieldId];
  const subsection = useSelector(state => state.resume.subsections.byId[subsectionId]);

  const fieldValueText = Node.string(field.value[0]);
  const placeholderFieldText = field.label;

  const handleDeleteField = async (fieldId) => {
    if (!confirm(`Are you sure you want to delete this field?`)) {
      return;
    }
    const autoSave = false;

    if (autoSave) {
      const fieldIsDeleted = await deleteFieldFromApi(fieldId);
      if (!fieldIsDeleted) {
        return;
      }
    }
    dispatch(deleteField(fieldId))
  }

  const moveFieldUpOrDown = (upOrDown) => {
    const fieldsInSubsection = subsection.fieldIds
      .map(id => fields.byId[id])
      .filter(Boolean)
      .sort((a, b) => a.position - b.position);

    const targetIndex =
      upOrDown === "down" ? fieldIndex + 1 : fieldIndex - 1;

    const fieldToSwapWith = fieldsInSubsection[targetIndex];

    if (!fieldToSwapWith) {
      alert(`You cannot move this field ${upOrDown} any further.`);
      return;
    }

    dispatch(swapFieldPositions({
      fieldId,
      targetFieldId: fieldToSwapWith.id,
    }));
  };

  return (
    <div
      key={fieldId}
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
      {/* <div className={styles.dragHandle}>⋮⋮</div> */}
      <div className={styles.upOrDownArrowWrapper}>
        {fieldIndex !== 0 &&
          <span
            className={styles.upOrDownArrow}
            onClick={() => moveFieldUpOrDown('up')}
          >
            ▲
          </span>
        }
        {fieldIndex !== subsection.fieldIds.length - 1 &&
          <span
            className={styles.upOrDownArrow}
            onClick={() => moveFieldUpOrDown('down')}
          >
            ▼
          </span>
        }
      </div>
      <p className={
        fieldValueText.length ? styles.subFieldText : styles.placeholderFieldText
      }>
        {fieldValueText || placeholderFieldText}
        {/* {fieldValueText.length ? fieldValueText : placeholderFieldText} */}
      </p>
      <button
        className={styles.deleteButton}
        onClick={() => handleDeleteField(fieldId)}
      // onClick={() =>
      //   dispatch(
      //     deleteField({
      //       sectionId,
      //       subsectionId,
      //       fieldId: field.id
      //     })
      //   )
      // }
      >
        ✕
      </button>
    </div>
  );
};

export default FieldRow;