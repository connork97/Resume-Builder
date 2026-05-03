import React, {Fragment, useEffect, useMemo, useCallback } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor, Editor, Transforms } from "slate";
import { useDispatch } from "react-redux";
import { updateFieldValue, setActiveEditorId, setActiveEditorSelection } from "../../../../../store/resumeSlice.js";

import renderLeaf from "./renderLeaf.jsx";
import RenderElement from "./RenderElement.jsx";

import { addListItem, indentList, outdentList } from "../../../../../helpers/listBehavior.js";

import { editorRegistry } from "../../../../../helpers/editorRegistry.js";
import { nanoid } from "@reduxjs/toolkit";

const SlateField = ({ field, sectionId, subsectionId }) => {
  // Stable editor instance
  // const editorId = useMemo(() => nanoid(), []);
  const editorId = useMemo(() => field.id, [])
  const editor = useMemo(() => withReact(createEditor()), []);
  const dispatch = useDispatch();


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

  const handleUpdateFieldValue = (newValue) => {
    dispatch(
      updateFieldValue({
        fieldId: field.id,
        newValue,
      })
    );
  };

  const handleKeyDown = (event) => {
    // Early exit from keydown function
    const validKeyDowns = ['Enter', 'Tab']
    if (!validKeyDowns.includes(event.key)) return;

    const [listItemEntry] = Editor.nodes(editor, {
      match: (n) => n.type === "list-item",
    });

    if (!listItemEntry) {
      console.error("No list item entry found.");
      return;
    };

    if (validKeyDowns.includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
    };

    if (event.key === "Enter") {
      // Editor.normalize(editor, { force: true });
      addListItem(editor, listItemEntry);
      return;
    }

    if (event.key === "Tab") {
      // Editor.normalize(editor, { force: true });
      if (event.shiftKey) {
        outdentList(editor, listItemEntry);
      } else {
        indentList(editor, listItemEntry);
      }
      return;
    }
  };

  return (
    <Slate
      editor={editor}
      initialValue={field.value ?? null
      }
      onChange={(value) => {
        handleUpdateFieldValue(value);
        dispatch(setActiveEditorSelection(editor.children));
      }

      }
      onClick={() => dispatch(setActiveEditorId(editorId))}
    >
      <Editable
        onKeyDown={handleKeyDown}
        onFocus={() => dispatch(setActiveEditorId(editorId))}
        onClick={() => dispatch(setActiveEditorId(editorId))}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={field.label}
      />
    </Slate>
  );
};

export default SlateField;