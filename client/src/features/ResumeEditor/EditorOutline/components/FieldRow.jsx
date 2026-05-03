import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Node } from 'slate';

import { deleteField, reorderFields, setResume, updateSubsection, swapFieldPositions } from "@/store/resumeSlice";

import styles from '../Outline.module.css';
import { BASE_URL } from '@/config';
import normalizeResumeFromApi from '@/utils/normalizeResumeFromApi';

const FieldRow = ({ fieldId, fieldIndex, sectionId, subsectionId, isHeaderOrSummary, dragItem, setDragItem }) => {

  const dispatch = useDispatch();

  const fields = useSelector(state => state.resume.fields);
  const field = fields.byId[fieldId];
  const subsection = useSelector(state => state.resume.subsections.byId[subsectionId]);

  const fieldValueText = Node.string(field.value[0]);
  const placeholderFieldText = field.label;

  const handleDeleteField = async (fieldId) => {
    dispatch(deleteField(fieldId))
    // if (!confirm(`Are you sure you want to delete this field?`)) {
    //   return;
    // }
    // try {
    //   const response = await fetch(`${BASE_URL}/fields/${fieldId}`, {
    //     method: 'DELETE',
    //     credentials: 'include',
    //   });
    //   const data = await response.json();
    //   if (!response.ok) {
    //     throw data?.error;
    //   }
    // const normalizedResume = normalizeResumeFromApi(data);
    // dispatch(setResume(normalizedResume));
    // } catch(error) {
    //   console.error(error);
    //   alert(
    //     error?.code && error?.message
    //     ? error.code + '\n' + error.message
    //     : `An error occurred while trying to delete field of ID ${fieldId}.`
    //   )
    // }
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