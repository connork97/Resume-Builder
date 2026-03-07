import React, { useMemo, useCallback, useEffect } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor } from "slate";
import { useDispatch } from "react-redux";
import { updateField, setActiveEditorId } from "../../store/resumeSlice.js";
import renderLeaf from './renderLeaf.jsx';
import RenderElement from './RenderElement.jsx';

import { editorRegistry } from './editorRegistry.js';
import { nanoid } from '@reduxjs/toolkit';

const SlateField = (({ field, sectionId, subsectionId }) => {
  const dispatch = useDispatch();

  // Stable editor instance
  const editorId = useMemo(() => nanoid(), []);
  const editor = useMemo(() => withReact(createEditor()), []);
  // console.log('EDITOR:', editor)
  useEffect(() => {
    editorRegistry.set(editorId, editor);
    // console.log("EDITOR REGISTRY: ", editorRegistry)
    return () => editorRegistry.delete(editorId);
  }, [editorId, editor]);

  if (!field.value) return null;
  
  const renderElement = useCallback((props) => {
    return (
      <RenderElement
        attributes={props.attributes}
        type={props.element.type}
        children={props.children}
        styling={{ minWidth: '4rem' }}
      />
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
        onFocus={() => dispatch(setActiveEditorId(editorId))}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={field.label}
      />
    </Slate>
  );
});

export default SlateField;