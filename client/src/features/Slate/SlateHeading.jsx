import React, { useMemo, useCallback, useEffect, useRef } from "react";
import { selectOnEditorEntry } from "../../helpers/slateHelpers/selectOnEditorEntry.js";
import { withInlineVoidIcons } from "../../helpers/slateHelpers/editorSchemaRules.js";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor } from "slate";
import { useDispatch, useSelector } from "react-redux";
import {
  updateSection,
  setActiveEditorId,
  setActiveEditorSelection,
} from "@/store/resumeSlice.js";

import Leaf from "@/features/Slate/renderLeaf.jsx";
import {
  getCascadedFontSize,
  getCascadedLineHeight,
} from "@/helpers/leafHelpers.js";
import RenderElement from "./RenderElement.jsx";

import { editorRegistry } from "../../helpers/editorRegistry.js";
import { handleHotKey } from "@/utils/hotKeys.js";
import { useSlateHistoryGrouping } from "@/hooks/useSlateHistoryGrouping.js";

const SlateHeading = ({ section }) => {
  const dispatch = useDispatch();
  const resumeStyling = useSelector((state) => state.resume.present.styling);
  const column = useSelector(
    (state) => state.resume.present.columns.byId[section.columnId],
  );
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
  // const editorId = useMemo(() => section?.id)
  const editorId = section?.id;
  const editor = useMemo(
    () => withReact(withInlineVoidIcons(createEditor())),
    [],
  );
  //   const editor = useMemo(() => withReact(createEditor()), []);

  const {
    getHistoryGroup,
    endHistoryGroup,
    onKeyDown: groupHistoryKeyDown,
    editableProps: historyInputProps,
  } = useSlateHistoryGrouping(editor, editorId);

  const isRestoringFromRedux = useRef(false);

  useEffect(() => {
    if (!section.value || editor.children === section.value) return;
    if (JSON.stringify(editor.children) === JSON.stringify(section.value)) return;

    endHistoryGroup();
    isRestoringFromRedux.current = true;
    try {
      editor.selection = null;
      editor.marks = null;
      editor.children = structuredClone(section.value);
      editor.onChange();
    } finally {
      isRestoringFromRedux.current = false;
    }
  }, [editor, section.value, endHistoryGroup]);

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
        />
      );
    },
    [resumeStyling, columnStyling, sectionStyling],
  );

  // Return nothing so Slate still runs its own focus and selection handlers.
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

  const handleUpdateSection = (newValue, historyGroup) => {
    dispatch({
      ...updateSection({ id: section.id, changes: { value: newValue } }),
      meta: { historyGroup },
    });
  };

  if (!section.value) return null;

  return (
    <Slate
      editor={editor}
      initialValue={section.value ?? null}
      onChange={(value) => {
        if (isRestoringFromRedux.current) return;
        const contentChanged = editor.operations.some(
          operation => operation.type !== "set_selection",
        );
        const historyGroup = getHistoryGroup();
        if (contentChanged) handleUpdateSection(value, historyGroup);
        dispatch(setActiveEditorSelection([...editor.children]));
      }}
    >
      <Editable
        {...historyInputProps}
        onMouseDown={(event) => selectOnEditorEntry(editor, event)}
          onFocus={handleActivateEditor}
        onKeyDown={(event) => {
          groupHistoryKeyDown(event);
          handleHotKey(editor, event);
        }}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={section.label}
        style={{
          fontSize: `${inheritedFontSize}px`,
          lineHeight: inheritedLineHeight,
        }}
      />
    </Slate>
  );
};

export default SlateHeading;
