import React, { useMemo, useCallback } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor } from "slate";
import { useDispatch } from "react-redux";
import { updateField } from "../../store/resumeSlice";
import renderLeaf from './renderLeaf.jsx';

const SlateField = (({ field, sectionId, subsectionId }) => {
  const dispatch = useDispatch();

  // Stable editor instance
  const editor = useMemo(() => withReact(createEditor()), []);
  if (!field.value) return null;
  const renderElement = useCallback((props) => {
    return (
      <p {...props.attributes} style={{ minWidth: "4rem" }}>
        {props.children}
      </p>
    );
  }, []);

  // console.log("FIELD VALUE:", field.value);

  const handleUpdateField = (newValue) => {
    dispatch(
      updateField({
        sectionId,
        subsectionId,
        fieldId: field.id,
        newValue,
      })
    );
  };


  return (
    <Slate
      editor={editor}
      initialValue={field.value ?? [
        { type: 'paragraph', children: [{ text: '' }] }
      ]}
      onChange={handleUpdateField}
      >
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={field.label}
      />
    </Slate>
  );
});

export default SlateField;