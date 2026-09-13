import { useEffect, useMemo } from 'react';
import { useStore } from 'react-redux';
import { createSlateHistoryGrouping, observeHistoryOperations } from '../helpers/slateHelpers/historyGrouping.js';

export function useSlateHistoryGrouping(editor, editorId) {
  const store = useStore();
  const grouping = useMemo(() => createSlateHistoryGrouping({ editorId }), [editorId]);

  useEffect(() => {
    const stopObserving = observeHistoryOperations(editor, grouping);
    let previous = store.getState().resume.present;
    const unsubscribe = store.subscribe(() => {
      const next = store.getState().resume.present;
      // Toolbar/outline selection can change while preventDefault keeps DOM
      // focus inside Slate. Filtered UI actions must still end a typing gesture.
      if (next.activeEditorId !== previous.activeEditorId
        || next.activeSectionIds !== previous.activeSectionIds) {
        grouping.endHistoryGroup();
      }
      previous = next;
    });
    return () => {
      unsubscribe();
      stopObserving();
    };
  }, [editor, grouping, store]);

  return useMemo(() => ({
    getHistoryGroup: () => grouping.getHistoryGroup(
      editor.operations, editor.selection, store.getState().resume.group, editor.marks,
    ),
    endHistoryGroup: grouping.endHistoryGroup,
    onKeyDown: grouping.keyDown,
    // These handlers deliberately return undefined so Slate still handles input.
    editableProps: {
      onDOMBeforeInput: event => { grouping.beforeInput(event.inputType); },
      onPaste: () => { grouping.isolatedInput(); },
      onCut: () => { grouping.isolatedInput(); },
      onDrop: () => { grouping.isolatedInput(); },
      onCompositionStart: () => { grouping.compositionStart(); },
      onCompositionEnd: () => { grouping.compositionEnd(); },
      onBlur: () => { grouping.blur(); },
      onPointerDown: () => { grouping.endHistoryGroup(); },
    },
  }), [editor, grouping, store]);
}
