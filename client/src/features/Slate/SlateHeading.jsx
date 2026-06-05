import React, { useMemo, useCallback, useEffect } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor } from "slate";
import { useDispatch, useSelector } from "react-redux";
import { updateSection, setActiveEditorId, setActiveEditorSelection } from "../../store/resumeSlice.js";

import Leaf, { getCascadedFontSize, getCascadedLineHeight } from "./renderLeaf.jsx";
import RenderElement from "./RenderElement.jsx";

import { editorRegistry } from "../../helpers/editorRegistry.js";
import { nanoid } from "@reduxjs/toolkit";

const SlateHeading = ({ section }) => {
  const dispatch = useDispatch();
  const resumeStyling = useSelector(state => state.resume.styling);
  const column = useSelector(state => state.resume.columns.byId[section.columnId]);
  const sectionStyling = section?.styling;
  const columnStyling = column?.styling;
  const inheritedFontSize = getCascadedFontSize({
    resumeStyling,
    columnStyling,
    sectionStyling,
  });
  const inheritedLineHeight = getCascadedLineHeight({
    resumeStyling,
    columnStyling,
    sectionStyling,
  });

  // Stable editor instance
  const editorId = useMemo(() => section?.id)
  // const editorId = useMemo(() => nanoid(), []);
  const editor = useMemo(() => withReact(createEditor()), []);

  useEffect(() => {
    editorRegistry.set(editorId, editor);
    return () => editorRegistry.delete(editorId);
  }, [editorId, editor]);

  const renderLeaf = useCallback((props) => {
    return (
      <Leaf
        {...props}
        resumeStyling={resumeStyling}
        columnStyling={columnStyling}
        sectionStyling={sectionStyling}
      />
    );
  }, [resumeStyling, columnStyling, sectionStyling]);

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
        id: section.id,
        changes: { value: newValue },
      })
    );
  };

  if (!section.value) return null;

  return (
    <Slate
      editor={editor}
      initialValue={
        section.value ?? null
      }
      onChange={(value) => {
        handleUpdateSection(value);
        dispatch(setActiveEditorSelection(editor.children));
      }}
    >
      <Editable
        onFocus={() => dispatch(setActiveEditorId(editorId))}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={section.label}
        style={{ fontSize: `${inheritedFontSize}px`, lineHeight: inheritedLineHeight }}
      />
    </Slate>
  );
};

export default SlateHeading;
