import React, { useEffect, useMemo, useCallback } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor, Editor, Transforms } from "slate";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFieldValue,
  setActiveEditorId,
  setActiveEditorSelection,
} from "../../store/resumeSlice.js";

import Leaf from "./renderLeaf.jsx";
import RenderElement from "./RenderElement.jsx";

import {
  addListItem,
  indentList,
  outdentList,
} from "../../helpers/listBehavior.js";

import { editorRegistry } from "../../helpers/editorRegistry.js";
import { getNodeString } from "@/helpers/getNodeString.js";
import { getMinWidth } from "@/helpers/getMinWidth.js";
import {
  getCascadedFontSize,
  getCascadedLineHeight,
} from "@/helpers/leafHelpers.js";
import { useSortable } from "@dnd-kit/react/sortable";
import { withHistory } from "slate-history";
import { toggleMark } from "@/helpers/marks.js";
import { toggleList } from "@/helpers/blocks.js";
import { handleHotKey } from "@/utils/hotKeys.js";

const SlateField = ({ field, index }) => {
  // Stable editor instance
  const fieldPlainText = getNodeString(field);
  const fieldMinWidth = !fieldPlainText ? getMinWidth(field.label) : "auto";

  const editorId = field.id;
  const editor = useMemo(() => withReact(withHistory(createEditor())), []);

  const dispatch = useDispatch();
  const resumeStyling = useSelector((state) => state.resume.styling);
  const subsection = useSelector(
    (state) => state.resume.subsections.byId[field.subsectionId],
  );
  const section = useSelector(
    (state) => state.resume.sections.byId[subsection?.sectionId],
  );
  const column = useSelector(
    (state) => state.resume.columns.byId[section?.columnId],
  );
  const fieldStyling = field?.styling;
  const columnStyling = column?.styling;
  const sectionStyling = section?.styling;
  const subsectionStyling = subsection?.styling;
  const inheritedFontSize = getCascadedFontSize({
    resumeStyling,
    columnStyling,
    sectionStyling,
    subsectionStyling,
    fieldStyling,
  });
  const inheritedLineHeight = getCascadedLineHeight({
    resumeStyling,
    columnStyling,
    sectionStyling,
    subsectionStyling,
    fieldStyling,
  });

  useEffect(() => {
    editorRegistry.set(editorId, editor);
    return () => editorRegistry.delete(editorId);
  }, [editorId, editor]);

  const renderLeaf = useCallback(
    (props) => {
      return (
        <Leaf
          {...props}
          resumeStyling={resumeStyling}
          columnStyling={columnStyling}
          sectionStyling={sectionStyling}
          subsectionStyling={subsectionStyling}
          fieldStyling={fieldStyling}
        />
      );
    },
    [
      resumeStyling,
      columnStyling,
      sectionStyling,
      subsectionStyling,
      fieldStyling,
    ],
  );

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
      }),
    );
  };

  if (!field.value) return null;

  return (
    <div
      style={{
        padding: "0 1rem",
        margin: "0 -1rem",
        cursor: "pointer",
      }}
    >
      <Slate
        editor={editor}
        initialValue={field.value ?? null}
        onChange={(value) => {
          handleUpdateFieldValue(value);
          dispatch(setActiveEditorSelection(editor.children));
        }}
        onClick={() => dispatch(setActiveEditorId(editorId))}
      >
        <Editable
          onKeyDown={(event) => handleHotKey(editor, event)}
          onFocus={() => dispatch(setActiveEditorId(editorId))}
          onClick={() => dispatch(setActiveEditorId(editorId))}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder={field.label}
          style={{
            position: "relative",
            minWidth: fieldMinWidth,
            fontSize: `${inheritedFontSize}px`,
            lineHeight: inheritedLineHeight,
            cursor: "text",
          }}
        />
        {/* </div> */}
      </Slate>
    </div>
  );
};

export default SlateField;