import { Path, Range } from 'slate';

export const TYPING_PAUSE_MS = 1000;
let nextGroupId = 0;
const copyRange = range => range ? structuredClone(range) : null;
const sameRange = (a, b) => a === b || Boolean(a && b && Range.equals(a, b));

/**
 * Per-editor, temporary input state; nothing here is part of the resume.
 * Every content batch is dispatched immediately. Group IDs merely tell
 * redux-undo which adjacent batches should share an undo entry.
 */
export function createSlateHistoryGrouping({
  editorId,
  now = Date.now,
  pauseMs = TYPING_PAUSE_MS,
  createId = () => `slate:${editorId}:${++nextGroupId}`,
}) {
  let active = null;
  let expectedSelection = null;
  let batchSelection;
  let intent = null;
  let composing = false;
  let finishingComposition = false;
  let compositionGroup = null;
  let previousMarks = 'null';

  const endHistoryGroup = () => {
    active = null;
    intent = null;
    batchSelection = undefined;
    expectedSelection = null;
    composing = false;
    finishingComposition = false;
    compositionGroup = null;
  };

  const beginIntent = kind => {
    if (finishingComposition) {
      finishingComposition = false;
      compositionGroup = null;
      active = null;
    }
    intent = kind;
    if (kind === 'isolated') active = null;
  };

  const beforeInput = inputType => {
    if (/composition/i.test(inputType)) {
      // Some mobile inputs report composition without a compositionstart event.
      if (!composing && !finishingComposition) {
        active = null;
        finishingComposition = true;
      }
      return;
    }
    if (composing) return;
    if (inputType === 'insertText') beginIntent('typing');
    else if (inputType === 'deleteContentBackward') beginIntent('backspace');
    else if (inputType === 'deleteContentForward') beginIntent('forward-delete');
    else beginIntent('isolated'); // paste, cut, Enter, word-delete, replacement…
  };

  const keyDown = event => {
    if (event.isComposing || event.nativeEvent?.isComposing || event.keyCode === 229 || composing) return;
    const { key, ctrlKey, metaKey, altKey } = event;
    if (['Shift', 'Control', 'Meta', 'Alt', 'CapsLock'].includes(key)) return;
    if (key.startsWith('Arrow') || ['Home', 'End', 'PageUp', 'PageDown', 'Escape'].includes(key)) {
      endHistoryGroup();
    } else if (key === 'Enter' || key === 'Tab' || ctrlKey || metaKey || altKey) {
      // Runs before custom list/formatting hotkeys, which may prevent beforeinput.
      beginIntent('isolated');
    } else if (key === 'Backspace') beginIntent('backspace');
    else if (key === 'Delete') beginIntent('forward-delete');
    else beginIntent('typing');
  };

  const observeOperation = (operation, selection) => {
    if (operation.type !== 'set_selection' && batchSelection === undefined) {
      // Capture BEFORE Slate moves the selection as a side effect of editing.
      batchSelection = copyRange(selection);
    }
  };

  const classify = (operations, before) => {
    if (intent === 'isolated' || (before && Range.isExpanded(before))) return 'isolated';
    if (operations.every(op => op.type === 'insert_text')) {
      // A multiword insertion arriving in one batch (paste, dictation, etc.) is
      // indivisible. Do not pretend to create intermediate document versions.
      const inserted = operations.map(op => op.text).join('');
      return /\s\S/u.test(inserted) ? 'isolated' : 'typing';
    }
    if (operations.every(op => op.type === 'remove_text')) {
      if (intent === 'backspace' || intent === 'forward-delete') return intent;
      const first = operations[0];
      if (before && Range.isCollapsed(before) && Path.equals(before.anchor.path, first.path)) {
        if (first.offset + first.text.length === before.anchor.offset) return 'backspace';
        if (first.offset === before.anchor.offset) return 'forward-delete';
      }
    }
    // Structural changes, formatting and delete+insert replacements are atomic.
    return 'isolated';
  };

  const getHistoryGroup = (operations, selection, currentHistoryGroup, marks = null) => {
    const changes = operations.filter(op => op.type !== 'set_selection');
    const marksKey = JSON.stringify(marks);
    const marksChanged = marksKey !== previousMarks;
    previousMarks = marksKey;
    if (changes.length === 0) {
      if (!composing && !finishingComposition
        && (marksChanged || !sameRange(expectedSelection, selection))) {
        active = null;
        intent = null;
      }
      expectedSelection = copyRange(selection);
      return null;
    }

    // A different global action, undo/redo, load, or clearHistory may have
    // interrupted this editor even if its value and DOM focus never changed.
    if (active && active.id !== currentHistoryGroup) active = null;
    if (compositionGroup && compositionGroup !== currentHistoryGroup) compositionGroup = null;

    const before = batchSelection ?? null;
    batchSelection = undefined;

    if (composing || finishingComposition) {
      compositionGroup ??= createId();
      expectedSelection = copyRange(selection);
      intent = null;
      return compositionGroup;
    }

    const kind = classify(changes, before);
    const time = now();
    const continues = active && kind !== 'isolated' && active.kind === kind
      && time >= active.time && time - active.time < pauseMs
      && before && Range.isCollapsed(before) && sameRange(expectedSelection, before);
    const id = continues ? active.id : createId();
    active = { id, kind, time };
    expectedSelection = copyRange(selection);
    intent = null;

    // Attach trailing whitespace to the preceding word, then start fresh.
    if (kind === 'isolated' || (kind === 'typing' && changes.some(op => /\s$/u.test(op.text)))) {
      active = null;
    }
    return id;
  };

  return {
    observeOperation,
    getHistoryGroup,
    endHistoryGroup,
    beforeInput,
    keyDown,
    isolatedInput: () => beginIntent('isolated'),
    compositionStart: () => {
      endHistoryGroup();
      composing = true;
    },
    compositionEnd: () => {
      composing = false;
      // Slate/browser may deliver the committed content after this event.
      // Retain the composition ID until the next ordinary input or boundary.
      finishingComposition = true;
    },
    blur: () => {
      if (composing || finishingComposition) {
        composing = false;
        finishingComposition = true;
        active = null;
      } else endHistoryGroup();
    },
  };
}

/** Observe operations without changing Slate's normalization or editing logic. */
export function observeHistoryOperations(editor, grouping) {
  const apply = editor.apply;
  const observedApply = operation => {
    grouping.observeOperation(operation, editor.selection);
    apply(operation);
  };
  editor.apply = observedApply;
  return () => {
    if (editor.apply === observedApply) editor.apply = apply;
    grouping.endHistoryGroup();
  };
}
