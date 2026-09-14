import React, { useEffect, useMemo, useCallback, useRef } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor } from "slate";
import { selectOnEditorEntry } from "../../helpers/slateHelpers/selectOnEditorEntry.js";
import { withInlineVoidIcons } from "../../helpers/slateHelpers/editorSchemaRules.js";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFieldValue,
  setActiveEditorId,
  setActiveEditorSelection,
} from "../../store/resumeSlice.js";

import Leaf from "./renderLeaf.jsx";
import RenderElement from "./RenderElement.jsx";

import { editorRegistry } from "../../helpers/editorRegistry.js";
import { getNodeString } from "@/helpers/getNodeString.js";
import { getMinWidth } from "@/helpers/getMinWidth.js";
import {
  getCascadedFontSize,
  getCascadedLineHeight,
} from "@/helpers/leafHelpers.js";
import { handleHotKey } from "@/utils/hotKeys.js";
import { useSlateHistoryGrouping } from "@/hooks/useSlateHistoryGrouping.js";

const SlateField = ({ field }) => {
  // Stable editor instance
  const fieldPlainText = getNodeString(field);
  const fieldMinWidth = !fieldPlainText ? getMinWidth(field.label) : "auto";

  const editorId = field.id;
  const editor = useMemo(
    () => withReact(withInlineVoidIcons(createEditor())),
    [],
  );

  const dispatch = useDispatch();
  const reduxResume = useSelector((state) => state.resume.present);
  const resumeGap = reduxResume.layout.gap;
  const resumeStyling = useSelector((state) => reduxResume.styling);
  const subsection = useSelector(
    (state) => state.resume.present.subsections.byId[field.subsectionId],
  );
  const section = useSelector(
    (state) => state.resume.present.sections.byId[subsection?.sectionId],
  );
  const column = useSelector(
    (state) => state.resume.present.columns.byId[section?.columnId],
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

  const {
    getHistoryGroup,
    endHistoryGroup,
    onKeyDown: groupHistoryKeyDown,
    editableProps: historyInputProps,
  } = useSlateHistoryGrouping(editor, editorId);

  const isRestoringFromRedux = useRef(false);

  useEffect(() => {
    if (!field.value || editor.children === field.value) return;
    if (JSON.stringify(editor.children) === JSON.stringify(field.value)) return;

    endHistoryGroup();
    isRestoringFromRedux.current = true;
    try {
      editor.selection = null;
      editor.marks = null;
      editor.children = structuredClone(field.value);
      editor.onChange();
    } finally {
      isRestoringFromRedux.current = false;
    }
  }, [editor, field.value, endHistoryGroup]);

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

  const handleActivateEditor = () => {
    endHistoryGroup();
    dispatch(setActiveEditorId(editorId));
  };

  const renderElement = useCallback((props) => {
    return (
      <RenderElement
        inheritedFontSize={inheritedFontSize}
        inheritedLineHeight={inheritedLineHeight}
        element={props.element}
        type={props.element.type}
        attributes={props.attributes}
        children={props.children}
      />
    );
  }, [inheritedFontSize, inheritedLineHeight]);

  const handleUpdateFieldValue = (newValue, historyGroup) => {
    dispatch({
      ...updateFieldValue({ fieldId: field.id, newValue }),
      meta: { historyGroup },
    });
  };

  if (!field.value) return null;

  return (
    <div
      style={{
        padding: "0 1rem",
        margin: "0 -1rem",
        cursor: "pointer",
        //   display: 'inline-block',
      }}
    >
      <Slate
        editor={editor}
        initialValue={field.value ?? null}
        onChange={(value) => {
          if (isRestoringFromRedux.current) return;
          const contentChanged = editor.operations.some(
            operation => operation.type !== "set_selection",
          );
          const historyGroup = getHistoryGroup();
          if (contentChanged) handleUpdateFieldValue(value, historyGroup);
          dispatch(setActiveEditorSelection([...editor.children]));
        }}
        onMouseDown={(event) => selectOnEditorEntry(editor, event)}
        onClick={handleActivateEditor}
      >
        <Editable
          {...historyInputProps}
          onKeyDown={(event) => {
            groupHistoryKeyDown(event);
            handleHotKey(editor, event);
          }}
          onMouseDown={(event) => selectOnEditorEntry(editor, event)}
          onFocus={handleActivateEditor}
          onClick={handleActivateEditor}
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
