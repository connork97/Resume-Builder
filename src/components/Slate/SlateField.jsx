import React, { useMemo, useCallback, useEffect } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor, Editor, Transforms } from "slate";
import { useDispatch } from "react-redux";
import { updateField, setActiveEditorId } from "../../store/resumeSlice.js";

import renderLeaf from "./renderLeaf.jsx";
import RenderElement from "./RenderElement.jsx";

import { addListItem, indentList, outdentList } from "./listBehavior.js";

import { editorRegistry } from "./editorRegistry.js";
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
        attributes={props.attributes}
        type={props.element.type}
        children={props.children}
      />
    );
  }, []);

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
      console.log("Adding List Item.")
      addListItem(editor, listItemEntry);
      return;
    }

    if (event.key === "Tab") {
      // Editor.normalize(editor, { force: true });
      if (event.shiftKey) {
        console.log("Outdenting List Item.")
        outdentList(editor, listItemEntry);
      } else {
        console.log("Indenting List Item.")
        indentList(editor, listItemEntry);
      }

      return;
    }
  };

  return (
    <Slate
      editor={editor}
      initialValue={
        field.value ?? [
          { type: "paragraph", children: [{ text: "" }] },
        ]
      }
      onChange={handleUpdateField}
    >
      <Editable
        onKeyDown={handleKeyDown}
        onFocus={() => dispatch(setActiveEditorId(editorId))}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={field.label}
      />
    </Slate>
  );
};

export default SlateField;