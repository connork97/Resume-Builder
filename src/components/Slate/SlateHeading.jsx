import React, { useMemo, useCallback, useEffect } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor, Editor, Transforms } from "slate";
import { useDispatch } from "react-redux";
import { updateSection, setActiveEditorId, setActiveEditorSelection } from "../../store/resumeSlice.js";

import renderLeaf from "./renderLeaf.jsx";
import RenderElement from "./RenderElement.jsx";

import { addListItem, indentList, outdentList } from "./helpers/listBehavior.js";

import { editorRegistry } from "./helpers/editorRegistry.js";
import { nanoid } from "@reduxjs/toolkit";

const SlateField = ({ field, sectionId, subsectionId }) => {
  const dispatch = useDispatch();

  // Stable editor instance
  const editorId = useMemo(() => nanoid(), []);
  // const editor = useMemo(() => withLists(withReact(createEditor())), []);
  const editor = useMemo(() => withReact(createEditor()), []);

  useEffect(() => {
    editorRegistry.set(editorId, editor);
    return () => editorRegistry.delete(editorId);
  }, [editorId, editor]);

  if (!field.value) return null;

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
        sectionId,
      //   subsectionId,
      //   fieldId: field.id,
        newValue,
      })
    );
  };



  return (
    <Slate
      editor={editor}
      initialValue={
        field.value ?? [
          { type: "paragraph", children: [{ text: "" }] },
        ]
      }
      onChange={(value) => {
        handleUpdateSection(value);
        dispatch(setActiveEditorSelection(editor.selection));
      }

      }
    >
      <Editable
        onFocus={() => dispatch(setActiveEditorId(editorId))}
        // onClick={() => dispatch(setActiveEditorId(editorId))}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={field.label}
        renderPlaceholder={(props) => (
          <span
            {...props.attributes}
            style={{ opacity: 0.5, pointerEvents: "none" }}
          >
            {props.children}
          </span>
        )}
      />
    </Slate>
  );
};

export default SlateField;