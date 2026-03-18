import React, { useMemo, useCallback, useEffect, use } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor, Editor, Transforms } from "slate";
import { useDispatch } from "react-redux";
import { updateSection, setActiveEditorId, setActiveEditorSelection } from "../../store/resumeSlice.js";

import renderLeaf from "./renderLeaf.jsx";
import RenderElement from "./RenderElement.jsx";

import { addListItem, indentList, outdentList } from "./helpers/listBehavior.js";

import { editorRegistry } from "./helpers/editorRegistry.js";
import { nanoid } from "@reduxjs/toolkit";

const SlateHeading = ({ section }) => {
  const dispatch = useDispatch();

  // Stable editor instance
  const editorId = useMemo(() => nanoid(), []);
  const editor = useMemo(() => withReact(createEditor()), []);

  useEffect(() => {
    editorRegistry.set(editorId, editor);
    return () => editorRegistry.delete(editorId);
  }, [editorId, editor]);

  if (!section.value) return null;

  const renderElement = useCallback((props) => {
    return (
      <RenderElement
        element={props.element}
        type={props.element.type}
        attributes={props.attributes}
        children={props.children}
      />
    );
  }, []);

  const handleUpdateSection = (newValue) => {
    dispatch(
      updateSection({
        sectionId: section.id,
        changes: { value: newValue },
      })
    );
  };



  return (
    <Slate
      editor={editor}
      initialValue={
        section.value ?? null
      }
      onChange={(value) => {
        handleUpdateSection(value);
        dispatch(setActiveEditorSelection(editor.selection));
      }}
    >
      <Editable
        onFocus={() => dispatch(setActiveEditorId(editorId))}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={section.label}
      />
    </Slate>
  );
};

export default SlateHeading;