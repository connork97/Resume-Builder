import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Node } from 'slate';

import { deleteField, reorderFields, setResume } from "@/store/resumeSlice";

import styles from './Outline.module.css';
import { BASE_URL } from '@/config';
import normalizeResumeFromApi from '@/utils/normalizeResumeFromApi';

const FieldRow = ({ fieldId, fieldIndex, sectionId, subsectionId, isHeaderOrSummary, dragItem, setDragItem }) => {

  const dispatch = useDispatch();

  const field = useSelector(state => state.resume.fields.byId[fieldId]);

  const fieldValueText = Node.string(field.value[0]);
  const placeholderFieldText = field.label;

  useEffect(() => {
    console.log('FIELD', field)

  }, [])

  const handleDeleteField = async (fieldId) => {
    if (!confirm(`Are you sure you want to delete this field?`)) {
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/fields/${fieldId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        throw data?.error;
      }
      const normalizedResume = normalizeResumeFromApi(data);
      dispatch(setResume(normalizedResume));
    } catch(error) {
      console.error(error);
      alert(
        error?.code && error?.message
        ? error.code + '\n' + error.message
        : `An error occurred while trying to delete field of ID ${fieldId}.`
      )
    }
  }

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
      <div className={styles.dragHandle}>⋮⋮</div>
      <p className={
        fieldValueText.length ? styles.subFieldText : styles.placeholderFieldText
      }>
        {fieldValueText}
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